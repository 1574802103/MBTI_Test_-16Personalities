import React from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import typesData from '../data/types.json';
import { TypeIcon } from '../components/icons/TypeIcons';
import { PersonalityType } from '../types';
import { motion } from 'framer-motion';

export const TypeLibrary: React.FC = () => {
  const categories = [
    {
      id: '分析家',
      color: 'bg-purple-100 text-purple-800',
      desc: '理性和公正的思考者，擅长战略规划和逻辑分析。'
    },
    {
      id: '外交家',
      color: 'bg-green-100 text-green-800',
      desc: '热情和有同理心的理想主义者，致力于建立人际连接。'
    },
    {
      id: '守护者',
      color: 'bg-blue-100 text-blue-800',
      desc: '务实和尽责的管理者，重视秩序、安全和稳定。'
    },
    {
      id: '探险家',
      color: 'bg-yellow-100 text-yellow-800',
      desc: '大胆和实际的行动者，擅长应对危机和创造新体验。'
    }
  ];

  const groupedTypes = (typesData as PersonalityType[]).reduce((acc, type) => {
    const cat = type.category || '其他';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(type);
    return acc;
  }, {} as Record<string, PersonalityType[]>);

  return (
    <Layout>
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="space-y-12 py-8 max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700 mb-4"
          >
            MBTI 性格资料库
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-gray-600"
          >
            探索16种不同的人格类型，了解他们的独特思维方式、行为模式和潜在优势。
          </motion.p>
        </div>

        {categories.map((cat) => (
          <section key={cat.id} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 border-b border-gray-200/50 pb-4"
            >
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <span className={`w-2 h-8 rounded-full mr-3 ${cat.color.split(' ')[0].replace('bg-', 'bg-')}`}></span>
                {cat.id}
              </h2>
              <span className={`px-4 py-1.5 rounded-full text-xs font-medium ${cat.color} backdrop-blur-sm bg-opacity-80`}>
                {cat.desc}
              </span>
            </motion.div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {groupedTypes[cat.id]?.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="h-full"
                >
                  <Link 
                    to={`/type/${type.id}`}
                    className="block glass-card rounded-2xl shadow-sm hover:shadow-xl transition-all border border-white/60 overflow-hidden h-full flex flex-col group"
                  >
                    <div className="p-6 flex flex-col items-center text-center flex-grow relative overflow-visible">
                      <div className={`absolute top-0 left-0 w-full h-1 ${cat.color.split(' ')[0]}`}></div>
                      
                      {/* Character Avatar */}
                      <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                        <TypeIcon type={type.id} size={120} className="filter drop-shadow-sm" />
                      </div>

                      <h3 className="text-3xl font-black text-gray-800 mb-1 group-hover:text-blue-600 transition-colors tracking-tight">{type.id}</h3>
                      <h4 className="text-lg font-bold text-gray-600 mb-4">{type.name}</h4>
                      <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed px-2">
                        {type.summary}
                      </p>
                    </div>
                    <div className="bg-gray-50/50 px-6 py-4 text-center text-xs font-bold text-gray-400 border-t border-gray-100/50 group-hover:text-blue-500 group-hover:bg-blue-50/30 transition-colors">
                      查看详情 →
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </Layout>
  );
};
