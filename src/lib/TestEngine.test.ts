
import { describe, it, expect, beforeEach } from 'vitest';
import { TestEngine } from './TestEngine';
import typesData from '../data/types.json';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('TestEngine', () => {
  
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('Question Bank Validation', () => {
    const PAIRS = [
      { key: 'EI', a: 'E', b: 'I' },
      { key: 'SN', a: 'S', b: 'N' },
      { key: 'TF', a: 'T', b: 'F' },
      { key: 'JP', a: 'J', b: 'P' }
    ] as const;

    const getPairKey = (values: Set<string>) => {
      for (const p of PAIRS) {
        if (values.size === 2 && values.has(p.a) && values.has(p.b)) return p.key;
      }
      return null;
    };

    it('should have well-formed questions across all versions', () => {
      const versions = [
        { version: 'quick' as const, expectedLength: 28, expectedMinPerPair: 7, expectedMaxPerPair: 7 },
        { version: 'standard' as const, expectedLength: 93, expectedMinPerPair: 23, expectedMaxPerPair: 24 },
        { version: 'full' as const, expectedLength: 200, expectedMinPerPair: 50, expectedMaxPerPair: 50 }
      ];

      for (const v of versions) {
        const engine = new TestEngine(v.version);
        const questions = engine.getQuestions();
        expect(questions.length).toBe(v.expectedLength);

        const ids = new Set<number>();
        const pairCounts: Record<string, number> = { EI: 0, SN: 0, TF: 0, JP: 0 };

        for (const q of questions) {
          expect(typeof q.id).toBe('number');
          expect(ids.has(q.id)).toBe(false);
          ids.add(q.id);

          expect(typeof q.text).toBe('string');
          expect(q.text.trim().length).toBeGreaterThan(0);
          expect(Array.isArray(q.options)).toBe(true);
          expect(q.options.length).toBe(2);

          const labels = new Set(q.options.map(o => o.label));
          expect(labels.size).toBe(2);
          expect(labels.has('A')).toBe(true);
          expect(labels.has('B')).toBe(true);

          const values = new Set(q.options.map(o => o.value));
          const pairKey = getPairKey(values);
          expect(pairKey).not.toBeNull();
          pairCounts[pairKey as keyof typeof pairCounts] += 1;

          for (const opt of q.options) {
            expect(typeof opt.text).toBe('string');
            expect(opt.text.trim().length).toBeGreaterThan(0);
          }
        }

        for (const p of PAIRS) {
          expect(pairCounts[p.key]).toBeGreaterThanOrEqual(v.expectedMinPerPair);
          expect(pairCounts[p.key]).toBeLessThanOrEqual(v.expectedMaxPerPair);
        }
      }
    });
  });

  describe('Types Data Validation', () => {
    it('should contain 16 unique MBTI types with required fields', () => {
      const types = typesData as unknown as Array<Record<string, unknown>>;
      expect(Array.isArray(types)).toBe(true);
      expect(types.length).toBe(16);

      const ids = new Set<string>();
      for (const t of types) {
        const id = String(t.id || '');
        expect(/^[EI][SN][TF][JP]$/.test(id)).toBe(true);
        expect(ids.has(id)).toBe(false);
        ids.add(id);

        expect(String(t.name || '').trim().length).toBeGreaterThan(0);
        expect(String(t.summary || '').trim().length).toBeGreaterThan(0);

        const description = t.description as Record<string, unknown> | undefined;
        expect(description).toBeTruthy();
        expect(Array.isArray(description?.traits)).toBe(true);
        expect((description?.traits as unknown[]).length).toBeGreaterThan(0);
      }
    });
  });

  describe('Quick Version', () => {
    let engine: TestEngine;
    beforeEach(() => {
      engine = new TestEngine('quick');
    });

    it('should initialize with 28 questions', () => {
      expect(engine.getQuestions().length).toBe(28);
    });

    it('should calculate scores correctly', () => {
      // Answer all as 'A'
      engine.getQuestions().forEach((_, i) => engine.answerQuestion(i, 'A'));
      const result = engine.calculateScores();
      expect(result.version).toBe('quick');
      // Just ensure we have a result
      expect(result.resultType.length).toBe(4);
    });
  });

  describe('Standard Version', () => {
    let engine: TestEngine;
    beforeEach(() => {
      engine = new TestEngine('standard');
    });

    it('should initialize with 93 questions', () => {
      expect(engine.getQuestions().length).toBe(93);
    });
  });

  describe('Full Version', () => {
    let engine: TestEngine;
    beforeEach(() => {
      engine = new TestEngine('full');
    });

    it('should initialize with 200 questions', () => {
      expect(engine.getQuestions().length).toBe(200);
    });
  });

  describe('Scoring Logic', () => {
    it('should mark all dimensions as X when each dichotomy is near-tie', () => {
      const engine = new TestEngine('quick');
      const questions = engine.getQuestions();

      const bucket: Record<'EI' | 'SN' | 'TF' | 'JP', number[]> = { EI: [], SN: [], TF: [], JP: [] };
      questions.forEach((q, idx) => {
        const values = new Set(q.options.map(o => o.value));
        if (values.has('E') && values.has('I')) bucket.EI.push(idx);
        else if (values.has('S') && values.has('N')) bucket.SN.push(idx);
        else if (values.has('T') && values.has('F')) bucket.TF.push(idx);
        else if (values.has('J') && values.has('P')) bucket.JP.push(idx);
      });

      (Object.keys(bucket) as Array<keyof typeof bucket>).forEach(key => {
        const indices = bucket[key];
        const firstHalf = Math.ceil(indices.length / 2);
        indices.forEach((idx, i) => {
          const q = questions[idx];
          const desired = i < firstHalf ? q.options[0].value : q.options[1].value;
          const choice = q.options.find(o => o.value === desired)?.label as 'A' | 'B';
          engine.answerQuestion(idx, choice);
        });
      });

      const result = engine.calculateScores();
      expect(result.dimensions.EI).toBe('X');
      expect(result.dimensions.SN).toBe('X');
      expect(result.dimensions.TF).toBe('X');
      expect(result.dimensions.JP).toBe('X');
    });
  });

  describe('Navigation', () => {
    let engine: TestEngine;
    beforeEach(() => {
      engine = new TestEngine('quick');
    });

    it('should jump to question', () => {
      expect(engine.jumpToQuestion(5)).toBe(true);
      expect(engine.getCurrentQuestion()?.id).toBe(engine.getQuestions()[5].id);
    });

    it('should not jump to invalid index', () => {
      expect(engine.jumpToQuestion(-1)).toBe(false);
      expect(engine.jumpToQuestion(1000)).toBe(false);
    });
  });
  
  describe('Progress Persistence', () => {
    it('should save and load progress', () => {
      const engine1 = new TestEngine('quick');
      engine1.answerQuestion(0, 'B');
      engine1.nextQuestion(); // index becomes 1
      
      // New engine instance should load from localStorage
      const engine2 = new TestEngine('quick');
      engine2.loadProgress();
      
      expect(engine2.getCurrentQuestion()?.id).toBe(engine2.getQuestions()[1].id);
      expect(engine2.getAnswer(engine2.getQuestions()[0].id)).toBe('B');
    });
  });
});
