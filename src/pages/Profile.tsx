import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { LocalStorageManager } from '../lib/LocalStorageManager';
import { Link } from 'react-router-dom';
import { TestResult } from '../types';
import { TypeIcon } from '../components/icons/TypeIcons';
import { Clock, Calendar, Trash2, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Profile: React.FC = () => {
  const [history, setHistory] = useState<TestResult[]>([]);

  useEffect(() => {
    setHistory(LocalStorageManager.load().testHistory);
  }, []);

  const clearAllHistory = () => {
    if (confirm('确定要清空所有测试记录吗？此操作不可恢复。')) {
      LocalStorageManager.clearHistory();
      setHistory([]);
    }
  };

  const deleteRecord = (id: string) => {
    if (confirm('确定要删除这条记录吗？')) {
      LocalStorageManager.deleteTestResult(id);
      setHistory(prev => prev.filter(h => h.id !== id));
    }
  };

  return (
    <Layout>
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-50/40 via-purple-50/40 to-pink-50/40"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold text-gray-900"
        >
          个人中心
        </motion.h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl shadow-sm border border-white/60 p-6 md:p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-blue-100/50 rounded-lg mr-3">
                <Clock className="text-blue-600" size={20} />
              </div>
              测试历史
            </h2>
            {history.length > 0 && (
              <button 
                onClick={clearAllHistory}
                className="text-sm text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center font-medium"
              >
                <Trash2 size={14} className="mr-1.5" /> 清空记录
              </button>
            )}
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-16 bg-white/40 rounded-2xl border border-white/40 dashed border-2 border-gray-200/50">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Clock size={32} />
              </div>
              <p className="text-gray-500 mb-6 font-medium">暂无测试记录</p>
              <Link to="/" className="inline-flex items-center bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 font-bold">
                开始第一次测试
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {history.map((h, index) => (
                  <motion.div 
                    key={h.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-panel p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between hover:bg-white/80 transition-all group border border-white/50 hover:shadow-md"
                  >
                    <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-auto">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center mr-4 bg-white/50 shadow-sm border border-white/50 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                        <TypeIcon type={h.resultType} size={56} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-2xl font-black text-gray-800 tracking-tight">{h.resultType}</span>
                          <span className="text-[10px] px-2 py-0.5 bg-gray-100 rounded-full border border-gray-200 text-gray-500 uppercase font-bold tracking-wider">
                            {h.version}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 font-medium">
                          <Calendar size={12} className="mr-1" />
                          {new Date(h.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                      <Link 
                        to={`/result/${h.resultType}`} 
                        className="flex items-center bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all text-sm font-bold shadow-sm"
                      >
                        查看详情 <ChevronRight size={14} className="ml-1" />
                      </Link>
                      <button
                        onClick={() => deleteRecord(h.id)}
                        className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
                        title="删除记录"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </Layout>
  );
};
