import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { LocalStorageManager } from '../lib/LocalStorageManager';
import { TestResult, PersonalityType } from '../types';
import typesData from '../data/types.json';
import { TypeIcon } from '../components/icons/TypeIcons';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { Share2, RefreshCw, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const Result: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult | null>(null);
  const [typeData, setTypeData] = useState<PersonalityType | null>(null);

  useEffect(() => {
    if (!type) {
      navigate('/');
      return;
    }

    const tData = (typesData as PersonalityType[]).find(t => t.id === type.toUpperCase());
    if (!tData) {
      navigate('/');
      return;
    }
    setTypeData(tData);

    // Try to find the latest result for this type
    const history = LocalStorageManager.load().testHistory;
    const latest = history.find(r => r.resultType === type.toUpperCase());
    if (latest) {
      setResult(latest);
    }
  }, [type, navigate]);

  if (!typeData) return <Layout><div>Loading...</div></Layout>;

  // Use lucky color for theme
  const themeColor = typeData.luckyColors?.primary || '#2563eb';
  const categoryName = typeData.category || 'MBTI Personality';

  // Prepare Chart Data
  const chartData = {
    labels: ['外向 (E)', '感觉 (S)', '思考 (T)', '判断 (J)', '内向 (I)', '直觉 (N)', '情感 (F)', '知觉 (P)'],
    datasets: [
      {
        label: '性格维度得分',
        data: result ? [
          result.scores.E,
          result.scores.S,
          result.scores.T,
          result.scores.J,
          result.scores.I,
          result.scores.N,
          result.scores.F,
          result.scores.P,
        ] : [50, 50, 50, 50, 50, 50, 50, 50],
        backgroundColor: `${themeColor}33`, // 20% opacity
        borderColor: themeColor,
        borderWidth: 2,
        pointBackgroundColor: themeColor,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: themeColor,
      },
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        angleLines: {
          display: true,
          color: 'rgba(0, 0, 0, 0.1)'
        },
        suggestedMin: 0,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        pointLabels: {
          font: {
            size: 12
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (
    <Layout>
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50"></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto py-8 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="glass-card rounded-3xl shadow-xl overflow-hidden border border-white/60"
        >
          {/* Header */}
          <div 
            className="p-8 md:p-12 text-center text-white relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)` }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
               <TypeIcon type={typeData.id} size={400} className="absolute -top-20 -right-20" color="white" />
            </div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="relative z-10"
            >
              <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-5 py-1.5 mb-6 text-sm font-bold tracking-wide border border-white/30 shadow-sm">
                {categoryName}
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold mb-4 tracking-tighter drop-shadow-sm">{typeData.id}</h1>
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white/95">{typeData.name}</h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
                {typeData.summary}
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 bg-white/40 backdrop-blur-sm">
            {/* Chart */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center justify-center bg-white/50 rounded-2xl p-6 shadow-sm border border-white/50"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
                <span className="w-1.5 h-6 rounded-full mr-2" style={{ backgroundColor: themeColor }}></span>
                维度得分分析
              </h3>
              <div className="w-full max-w-md aspect-square relative">
                <Radar data={chartData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Actions & Brief */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col justify-center space-y-6"
            >
              <div className="glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                  <BookOpen size={20} className="mr-2" style={{ color: themeColor }}/> 
                  核心特征
                </h3>
                <div className="flex flex-wrap gap-2">
                  {typeData.description.traits.map((trait, idx) => (
                    <span key={idx} className="bg-white/80 border border-gray-200/60 px-3 py-1.5 rounded-xl text-sm text-gray-700 shadow-sm">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* Famous People Teaser */}
              {typeData.famousPeople && typeData.famousPeople.length > 0 && (
                <div className="glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider flex items-center">
                    <span className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: themeColor }}></span>
                    代表人物
                  </h3>
                  <div className="flex items-center space-x-4">
                     {typeData.famousPeople.slice(0, 3).map((person, idx) => (
                        <div key={idx} className="text-center group">
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mb-1 mx-auto shadow-sm group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: themeColor }}
                          >
                            {person.name.charAt(0)}
                          </div>
                          <div className="text-xs text-gray-600 truncate w-16 font-medium">{person.name}</div>
                        </div>
                     ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-2">
                <Link 
                  to={`/type/${typeData.id}`}
                  className="col-span-2 text-white py-4 rounded-xl font-bold text-center hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center"
                  style={{ backgroundColor: themeColor, boxShadow: `0 10px 20px -5px ${themeColor}66` }}
                >
                  查看详细分析报告
                </Link>
                <button 
                  onClick={() => navigate('/')}
                  className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center shadow-sm"
                >
                  <RefreshCw size={18} className="mr-2"/> 重测
                </button>
                <button 
                  className="bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center shadow-sm"
                >
                  <Share2 size={18} className="mr-2"/> 分享
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};
