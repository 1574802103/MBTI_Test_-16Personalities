import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { TestEngine } from '../lib/TestEngine';
import { LocalStorageManager } from '../lib/LocalStorageManager';
import { Question } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Keyboard } from 'lucide-react';

export const Test: React.FC = () => {
  const { version } = useParams<{ version: string }>();
  const navigate = useNavigate();
  const [engine, setEngine] = useState<TestEngine | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [progress, setProgress] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);
  const [prevAnswer, setPrevAnswer] = useState<'A' | 'B' | undefined>(undefined);

  useEffect(() => {
    if (version && ['quick', 'standard', 'full'].includes(version)) {
      const newEngine = new TestEngine(version as 'quick' | 'standard' | 'full');
      
      // Check for resume flag
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('resume') === 'true') {
        newEngine.loadProgress();
      }
      
      setEngine(newEngine);
      updateState(newEngine);
      setTotalQuestions(newEngine.getQuestions().length);
    } else {
      navigate('/');
    }
  }, [version, navigate]);

  const updateState = (eng: TestEngine) => {
    setCurrentQuestion(eng.getCurrentQuestion());
    setProgress(eng.getProgress());
    const q = eng.getCurrentQuestion();
    if (q) {
      const idx = eng.getQuestions().findIndex(item => item.id === q.id);
      
      setPage(([prevPage]) => {
        const newDirection = idx > prevPage ? 1 : idx < prevPage ? -1 : 0;
        return [idx, newDirection];
      });
      
      setPrevAnswer(eng.getAnswer(q.id));
      setSelectedOption(null);
    }
  };

  const handleAnswer = useCallback((questionId: number, choice: 'A' | 'B') => {
    if (!engine) return;

    const idx = engine.getQuestions().findIndex(q => q.id === questionId);
    if (idx === -1) return;
    
    engine.answerQuestion(idx, choice);

    // Only auto-advance if we are still on the same question
    const currentQ = engine.getCurrentQuestion();
    if (currentQ && currentQ.id === questionId) {
      if (engine.isComplete() && idx === totalQuestions - 1) {
        try {
          const result = engine.calculateScores();
          LocalStorageManager.addTestResult(result);
          LocalStorageManager.clearCurrentTest(engine.getVersion());
          navigate(`/result/${result.resultType}`, { replace: true });
        } catch (error) {
          console.error('Error calculating result:', error);
          alert('计算结果时出现错误，请稍后重试');
        }
      } else {
        const moved = engine.nextQuestion();
        if (!moved && !engine.isComplete()) {
          // Find first unanswered question
          const questions = engine.getQuestions();
          const firstUnanswered = questions.findIndex(q => !engine.getAnswer(q.id));
          if (firstUnanswered !== -1) {
            engine.jumpToQuestion(firstUnanswered);
          }
        }
        updateState(engine);
      }
    } else {
      // Just update state (progress, answers) without moving
      updateState(engine);
    }
  }, [engine, totalQuestions, navigate]);

  const handleOptionSelect = useCallback((choice: 'A' | 'B') => {
    if (selectedOption || !currentQuestion) return;
    setSelectedOption(choice);
    const qId = currentQuestion.id;
    setTimeout(() => {
      handleAnswer(qId, choice);
      setSelectedOption(null);
    }, 350);
  }, [handleAnswer, selectedOption, currentQuestion]);

  const handlePrev = useCallback(() => {
    if (engine) {
      engine.previousQuestion();
      updateState(engine);
    }
  }, [engine]);

  const handleNext = useCallback(() => {
    if (engine) {
      // Only allow next if already answered (for reviewing) or an option is selected (though UI handles auto-advance)
      if (prevAnswer) {
          engine.nextQuestion();
          updateState(engine);
      }
    }
  }, [engine, prevAnswer]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedOption) return;
      if (['a', 'A', '1'].includes(e.key)) handleOptionSelect('A');
      if (['b', 'B', '2'].includes(e.key)) handleOptionSelect('B');
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleOptionSelect, handlePrev, handleNext, selectedOption]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.95
    })
  };

  if (!currentQuestion) return <Layout><div>Loading...</div></Layout>;

  return (
    <Layout>
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-3xl mx-auto py-8 md:py-12 px-4">
        <div className="mb-8">
          <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
            <span>进度 {progress}%</span>
            <span>{page + 1} / {totalQuestions}</span>
          </div>
          <div className="w-full bg-white/50 backdrop-blur-sm rounded-full h-3 p-0.5 shadow-inner border border-white/20">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500 ease-out shadow-sm" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={currentQuestion.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="glass-card rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-center relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
            <div className="absolute top-6 right-6 text-gray-400/80">
               <span className="text-xs font-mono border border-gray-200/50 bg-white/30 rounded px-2 py-1">#{currentQuestion.id}</span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-12 text-center leading-relaxed drop-shadow-sm">
              {currentQuestion.text}
            </h2>

            <div className="grid gap-5">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option.label || (!selectedOption && prevAnswer === option.label);
                const isOtherSelected = (selectedOption && selectedOption !== option.label) || (!selectedOption && prevAnswer && prevAnswer !== option.label);
                
                // Determine color based on option (A/B) for consistent theming
                // Usually A is related to E/S/T/J and B to I/N/F/P, or vice versa depending on question.
                // We'll stick to a neutral but interactive color scheme.
                
                return (
                  <motion.button
                    key={option.label}
                    onClick={() => handleOptionSelect(option.label as 'A' | 'B')}
                    whileHover={!selectedOption ? { scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.9)" } : {}}
                    whileTap={!selectedOption ? { scale: 0.98 } : {}}
                    animate={isSelected ? { 
                      scale: 1.02, 
                      borderColor: '#4f46e5', 
                      backgroundColor: 'rgba(238, 242, 255, 0.9)',
                      boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.1), 0 4px 6px -2px rgba(79, 70, 229, 0.05)'
                    } : { 
                      opacity: isOtherSelected ? 0.6 : 1,
                      scale: isOtherSelected ? 0.98 : 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.6)'
                    }}
                    transition={{ duration: 0.2 }}
                    className={`group relative flex items-center p-5 md:p-6 border-2 rounded-2xl transition-all text-left w-full backdrop-blur-sm
                      ${isSelected 
                        ? 'border-indigo-500 ring-2 ring-indigo-200/50' 
                        : 'border-white/50 hover:border-indigo-300 shadow-sm hover:shadow-md'
                      }`}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-xl font-bold text-lg flex items-center justify-center transition-all mr-5 shadow-sm
                      ${isSelected 
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-indigo-200' 
                        : 'bg-white text-gray-500 group-hover:bg-indigo-500 group-hover:text-white'
                      }`}
                    >
                      {option.label}
                    </div>
                    <span className={`text-lg font-medium transition-colors flex-1
                      ${isSelected 
                        ? 'text-indigo-900' 
                        : 'text-gray-700 group-hover:text-gray-900'
                      }`}
                    >
                      {option.text}
                    </span>
                    <span className={`absolute right-4 text-xs font-mono hidden md:block transition-colors
                      ${isSelected 
                        ? 'text-indigo-400' 
                        : 'text-gray-300 group-hover:text-indigo-300'
                      }`}
                    >
                      [{option.label === 'A' ? 'A / 1' : 'B / 2'}]
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-between items-center text-gray-600">
          <button 
            onClick={handlePrev}
            disabled={page === 0}
            className={`flex items-center space-x-2 px-6 py-4 rounded-xl transition-all ${
              page === 0 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-white/80 hover:shadow-sm active:scale-95 bg-white/40 backdrop-blur-sm'
            }`}
          >
            <ArrowLeft size={18} />
            <span className="font-medium">上一题</span>
          </button>
          
          <div className="hidden md:flex items-center space-x-3 text-xs text-gray-500 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/40 shadow-sm">
            <span className="flex items-center font-medium text-indigo-600"><Keyboard size={14} className="mr-1.5"/> 快捷键</span>
            <span className="bg-white/60 px-2 py-0.5 rounded border border-white/50">1 / A</span>
            <span className="bg-white/60 px-2 py-0.5 rounded border border-white/50">2 / B</span>
            <span className="bg-white/60 px-2 py-0.5 rounded border border-white/50">←</span>
            <span className="bg-white/60 px-2 py-0.5 rounded border border-white/50">→</span>
          </div>

          <button 
            onClick={handleNext}
            disabled={!prevAnswer || page === totalQuestions - 1}
            className={`flex items-center space-x-2 px-6 py-4 rounded-xl transition-all ${
              !prevAnswer || page === totalQuestions - 1 
                ? 'opacity-40 cursor-not-allowed' 
                : 'hover:bg-white/80 hover:shadow-sm active:scale-95 bg-white/40 backdrop-blur-sm'
            }`}
          >
            <span className="font-medium">下一题</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </Layout>
  );
};
