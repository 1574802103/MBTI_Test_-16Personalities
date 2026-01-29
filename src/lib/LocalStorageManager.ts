import { TestResult } from '../types';

interface TestProgress {
  version: 'quick' | 'standard' | 'full';
  answers: Record<number, 'A' | 'B'>;
  currentIndex: number;
  startTime: number;
  lastUpdate: number;
}

interface LocalStorageData {
  savedTests: Record<string, TestProgress>;
  
  testHistory: TestResult[];
  
  userPreferences: {
    theme: 'light' | 'dark';
    shortcuts: boolean;
    animations: boolean;
    language: 'zh-CN' | 'en';
  };
  
  favorites: string[]; // 收藏的MBTI类型
}

export class LocalStorageManager {
  private static readonly KEY = 'mbti-app-data';
  
  static save(data: Partial<LocalStorageData>): void {
    const existing = this.load();
    const updated = { ...existing, ...data };
    localStorage.setItem(this.KEY, JSON.stringify(updated));
  }
  
  static load(): LocalStorageData {
    const raw = localStorage.getItem(this.KEY);
    if (!raw) return this.getDefaultData();
    try {
      return this.normalize(JSON.parse(raw));
    } catch {
      return this.getDefaultData();
    }
  }
  
  static clear(): void {
    localStorage.removeItem(this.KEY);
  }
  
  static saveCurrentTest(version: string, testData: TestProgress): void {
    const data = this.load();
    data.savedTests = data.savedTests || {};
    data.savedTests[version] = testData;
    this.save({ savedTests: data.savedTests });
  }

  static getSavedTest(version: string): TestProgress | undefined {
    const data = this.load();
    return data.savedTests ? data.savedTests[version] : undefined;
  }

  static clearCurrentTest(version: string): void {
    const data = this.load();
    if (data.savedTests) {
      delete data.savedTests[version];
      this.save({ savedTests: data.savedTests });
    }
  }

  static addTestResult(result: TestResult): void {
    const data = this.load();
    data.testHistory.unshift(result);
    this.save({ testHistory: data.testHistory });
  }

  static clearHistory(): void {
    this.save({ testHistory: [] });
  }

  static deleteTestResult(id: string): void {
    const data = this.load();
    data.testHistory = data.testHistory.filter(h => h.id !== id);
    this.save({ testHistory: data.testHistory });
  }

  private static normalize(input: unknown): LocalStorageData {
    const defaults = this.getDefaultData();
    const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);

    if (!isRecord(input)) return defaults;

    const out: LocalStorageData = { ...defaults };

    if (isRecord(input.userPreferences)) {
      const theme = input.userPreferences.theme;
      const shortcuts = input.userPreferences.shortcuts;
      const animations = input.userPreferences.animations;
      const language = input.userPreferences.language;

      out.userPreferences = {
        theme: theme === 'dark' ? 'dark' : 'light',
        shortcuts: typeof shortcuts === 'boolean' ? shortcuts : defaults.userPreferences.shortcuts,
        animations: typeof animations === 'boolean' ? animations : defaults.userPreferences.animations,
        language: language === 'en' ? 'en' : 'zh-CN'
      };
    }

    if (Array.isArray(input.favorites)) {
      out.favorites = input.favorites.filter((x): x is string => typeof x === 'string');
    }

    const isTestProgress = (v: unknown): v is TestProgress => {
      if (!isRecord(v)) return false;
      const version = v.version;
      const answers = v.answers;
      const currentIndex = v.currentIndex;
      const startTime = v.startTime;
      const lastUpdate = v.lastUpdate;

      const validVersion = version === 'quick' || version === 'standard' || version === 'full';
      if (!validVersion) return false;
      if (!isRecord(answers)) return false;
      if (typeof currentIndex !== 'number' || typeof startTime !== 'number' || typeof lastUpdate !== 'number') return false;

      for (const val of Object.values(answers)) {
        if (val !== 'A' && val !== 'B') return false;
      }
      return true;
    };

    if (isRecord(input.savedTests)) {
      const saved: Record<string, TestProgress> = {};
      for (const [k, v] of Object.entries(input.savedTests)) {
        if (isTestProgress(v)) saved[k] = v;
      }
      out.savedTests = saved;
    }

    const isTestResult = (v: unknown): v is TestResult => {
      if (!isRecord(v)) return false;
      const id = v.id;
      const timestamp = v.timestamp;
      const version = v.version;
      const scores = v.scores;
      const resultType = v.resultType;
      const dimensions = v.dimensions;

      const validVersion = version === 'quick' || version === 'standard' || version === 'full';
      if (typeof id !== 'string' || typeof timestamp !== 'number' || !validVersion) return false;
      if (typeof resultType !== 'string') return false;
      if (!isRecord(scores) || !isRecord(dimensions)) return false;

      const scoreKeys = ['E', 'I', 'S', 'N', 'T', 'F', 'J', 'P'] as const;
      for (const key of scoreKeys) {
        if (typeof scores[key] !== 'number') return false;
      }

      const dimKeys = ['EI', 'SN', 'TF', 'JP'] as const;
      for (const key of dimKeys) {
        const val = dimensions[key];
        if (typeof val !== 'string') return false;
      }

      return true;
    };

    if (Array.isArray(input.testHistory)) {
      out.testHistory = input.testHistory.filter(isTestResult);
    }

    return out;
  }
  
  private static getDefaultData(): LocalStorageData {
    return {
      savedTests: {},
      testHistory: [],
      userPreferences: {
        theme: 'light',
        shortcuts: true,
        animations: true,
        language: 'zh-CN'
      },
      favorites: []
    };
  }
}
