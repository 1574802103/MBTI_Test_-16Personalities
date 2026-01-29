import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LocalStorageManager } from '../lib/LocalStorageManager';
import { Timer, Zap, ListChecks, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeIcon } from '../components/icons/TypeIcons';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [resumeDialog, setResumeDialog] = useState<{ isOpen: boolean; version: string | null }>({
    isOpen: false,
    version: null
  });

  const handleVersionClick = (versionId: string) => {
    const saved = LocalStorageManager.getSavedTest(versionId);
    if (saved) {
      setResumeDialog({ isOpen: true, version: versionId });
    } else {
      navigate(`/test/${versionId}`);
    }
  };

  const handleResume = () => {
    if (resumeDialog.version) {
      navigate(`/test/${resumeDialog.version}?resume=true`);
      setResumeDialog({ isOpen: false, version: null });
    }
  };

  const handleRestart = () => {
    if (resumeDialog.version) {
      LocalStorageManager.clearCurrentTest(resumeDialog.version);
      navigate(`/test/${resumeDialog.version}`);
      setResumeDialog({ isOpen: false, version: null });
    }
  };

  const versions = [
    {
      id: 'quick',
      title: '快速版测试',
      questions: 28,
      time: '约 5 分钟',
      desc: '适合时间有限，想要快速了解大致性格倾向的用户。',
      icon: Zap,
      color: 'text-yellow-600',
      bg: 'bg-gradient-to-br from-yellow-50 to-orange-50',
      border: 'border-yellow-200'
    },
    {
      id: 'standard',
      title: '标准版测试',
      questions: 93,
      time: '约 15 分钟',
      desc: '经典的MBTI测试版本，平衡了准确度与耗时，适合大多数用户。',
      icon: CheckCircle2,
      color: 'text-blue-600',
      bg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
      border: 'border-blue-200'
    },
    {
      id: 'full',
      title: '完整版测试',
      questions: 200,
      time: '约 30 分钟',
      desc: '最详尽的深度分析，适合追求极高准确度和自我认知的用户。',
      icon: ListChecks,
      color: 'text-purple-600',
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      border: 'border-purple-200'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Layout>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-24"
      >
        {/* Hero Section */}
        <section className="text-center space-y-8 py-12 relative overflow-visible">
          {/* Animated Background Characters */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
             <motion.div 
               className="absolute top-10 left-[10%]"
               animate={{ y: [0, -20, 0] }} 
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             >
               <TypeIcon type="ENFP" size={140} className="opacity-20 rotate-[-10deg]" />
             </motion.div>
             <motion.div 
               className="absolute top-20 right-[15%]"
               animate={{ y: [0, 20, 0] }} 
               transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             >
               <TypeIcon type="INTJ" size={160} className="opacity-20 rotate-[10deg]" />
             </motion.div>
             <motion.div 
               className="absolute bottom-0 left-[20%]"
               animate={{ y: [0, -15, 0] }} 
               transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
             >
               <TypeIcon type="ISTP" size={120} className="opacity-20 rotate-[5deg]" />
             </motion.div>
             <motion.div 
               className="absolute bottom-10 right-[20%]"
               animate={{ y: [0, 15, 0] }} 
               transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
             >
               <TypeIcon type="ESFJ" size={130} className="opacity-20 rotate-[-5deg]" />
             </motion.div>
          </div>
          
          <motion.div variants={itemVariants} className="relative z-10">
            <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-sm font-bold mb-4 tracking-wide uppercase">MBTI MASTER</span>
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              探索你的 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">性格代码</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              基于荣格心理学理论的专业MBTI人格测试，帮助你深入了解自己的优势、职业潜能与人际关系。
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center gap-4 relative z-10 px-4">
            <button 
              onClick={() => handleVersionClick('standard')}
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              立即开始测试
            </button>
            <button 
              onClick={() => navigate('/types')}
              className="w-full sm:w-auto bg-white text-gray-700 px-8 py-4 rounded-full font-bold text-lg border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
            >
              了解性格类型
            </button>
          </motion.div>
        </section>

        {/* Version Selection */}
        <section className="px-4">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">选择适合你的测试版本</h2>
            <p className="text-gray-500 mt-2">根据你的时间安排和需求选择</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {versions.map((v) => (
              <motion.div
                key={v.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className={`relative glass-card rounded-3xl p-8 border ${v.border} cursor-pointer group overflow-hidden flex flex-col`}
                onClick={() => handleVersionClick(v.id)}
              >
                <div className={`absolute inset-0 ${v.bg} opacity-50`}></div>
                
                <div className="relative z-10 flex-grow">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-300`}>
                      <v.icon className={`w-7 h-7 ${v.color}`} />
                    </div>
                    {v.id === 'standard' && (
                      <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                        推荐
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{v.title}</h3>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6 font-medium">
                    <span className="flex items-center bg-white/60 px-2 py-1 rounded"><ListChecks size={14} className="mr-1.5"/> {v.questions} 题</span>
                    <span className="flex items-center bg-white/60 px-2 py-1 rounded"><Timer size={14} className="mr-1.5"/> {v.time}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    {v.desc}
                  </p>
                </div>

                <div className="relative z-10">
                  <button className={`w-full py-3.5 px-4 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center group-hover:gap-2 ${
                    v.id === 'standard' 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}>
                    开始测试
                    <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">→</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Intro to 16 Types */}
        <section className="py-12 px-4 bg-white/50 rounded-[3rem] border border-white/60 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <motion.div variants={itemVariants}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">不仅仅是四个字母</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                MBTI (Myers-Briggs Type Indicator) 将人格分为16种类型，每种类型都有其独特的思维方式、价值观和行为模式。
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  { label: "分析家", color: "bg-purple-100 text-purple-700", desc: "理性的战略家 (INTJ, INTP, ENTJ, ENTP)" },
                  { label: "外交家", color: "bg-green-100 text-green-700", desc: "富有同情心的理想主义者 (INFJ, INFP, ENFJ, ENFP)" },
                  { label: "守护者", color: "bg-blue-100 text-blue-700", desc: "务实的管理者 (ISTJ, ISFJ, ESTJ, ESFJ)" },
                  { label: "探险家", color: "bg-yellow-100 text-yellow-700", desc: "大胆的行动者 (ISTP, ISFP, ESTP, ESFP)" },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center p-3 rounded-xl hover:bg-white/60 transition-colors">
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold mr-4 ${item.color}`}>{item.label}</span>
                    <span className="text-gray-700 font-medium">{item.desc}</span>
                  </li>
                ))}
              </ul>
              <button 
                onClick={() => navigate('/types')}
                className="text-blue-600 font-bold hover:text-blue-700 flex items-center group"
              >
                查看所有类型 <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 gap-4"
            >
               <div className="space-y-4 mt-8">
                 <div className="bg-purple-50 p-6 rounded-2xl text-center">
                   <TypeIcon type="ENTP" size={80} className="mx-auto mb-2" />
                   <span className="text-purple-900 font-bold text-sm">辩论家 ENTP</span>
                 </div>
                 <div className="bg-green-50 p-6 rounded-2xl text-center">
                   <TypeIcon type="INFP" size={80} className="mx-auto mb-2" />
                   <span className="text-green-900 font-bold text-sm">调停者 INFP</span>
                 </div>
               </div>
               <div className="space-y-4">
                 <div className="bg-blue-50 p-6 rounded-2xl text-center">
                   <TypeIcon type="ISTJ" size={80} className="mx-auto mb-2" />
                   <span className="text-blue-900 font-bold text-sm">物流师 ISTJ</span>
                 </div>
                 <div className="bg-yellow-50 p-6 rounded-2xl text-center">
                   <TypeIcon type="ESFP" size={80} className="mx-auto mb-2" />
                   <span className="text-yellow-900 font-bold text-sm">表演者 ESFP</span>
                 </div>
               </div>
            </motion.div>
          </div>
        </section>
      </motion.div>

      {/* Resume Dialog */}
      <AnimatePresence>
        {resumeDialog.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative overflow-hidden"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">发现未完成的测试</h3>
              </div>
              
              <p className="text-gray-600 mb-8">
                您有一个未完成的{resumeDialog.version === 'quick' ? '快速版' : resumeDialog.version === 'standard' ? '标准版' : '完整版'}测试记录。
                <br />
                是否继续上次的进度？
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleRestart}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                >
                  重新开始
                </button>
                <button
                  onClick={handleResume}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                >
                  继续答题
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Layout>
  );
};
