import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import typesData from '../data/types.json';
import { TypeIcon } from '../components/icons/TypeIcons';
import { PersonalityType } from '../types';
import { Briefcase, Star, AlertCircle, Heart, Palette, TrendingUp, ArrowLeft } from 'lucide-react';

export const PersonalityDetail: React.FC = () => {
  const { typeId } = useParams<{ typeId: string }>();
  const navigate = useNavigate();
  const [typeData, setTypeData] = useState<PersonalityType | null>(null);

  useEffect(() => {
    if (!typeId) {
      navigate('/types');
      return;
    }
    const data = (typesData as PersonalityType[]).find(t => t.id === typeId.toUpperCase());
    if (data) setTypeData(data);
    else navigate('/types');
  }, [typeId, navigate]);

  if (!typeData) return <Layout><div>Loading...</div></Layout>;

  const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType, title: string }) => (
    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
      <div className="p-2.5 bg-blue-100/50 rounded-xl mr-3 shadow-sm">
        <Icon size={20} className="text-blue-600" />
      </div>
      {title}
    </h3>
  );

  return (
    <Layout>
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8 py-8 px-4">
        <button 
          onClick={() => navigate('/types')}
          className="flex items-center text-gray-500 hover:text-blue-600 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center mr-2 group-hover:bg-blue-100 transition-colors shadow-sm">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span className="font-medium">返回性格库</span>
        </button>

        {/* Header */}
        <div className="glass-card rounded-3xl shadow-lg p-8 md:p-12 flex flex-col md:flex-row items-center border border-white/60 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500"></div>
          <div className="flex-shrink-0 mb-8 md:mb-0 md:mr-12 relative group w-48 h-48 md:w-60 md:h-60">
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full group-hover:bg-blue-400/30 transition-colors duration-500"></div>
            <TypeIcon type={typeData.id} size="100%" className="text-blue-600 relative z-10 drop-shadow-xl hover:scale-105 transition-transform duration-500" />
          </div>
          <div className="text-center md:text-left relative z-10">
            <div className="inline-block bg-blue-50/80 backdrop-blur-sm text-blue-700 font-bold px-4 py-1.5 rounded-full text-sm mb-5 shadow-sm border border-blue-100">
              {typeData.category || 'MBTI 类型'}
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-3 tracking-tight">{typeData.id}</h1>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-5">{typeData.name}</h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              {typeData.summary}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* Traits */}
          <div className="glass-panel rounded-2xl shadow-sm p-8 border border-white/50 hover:shadow-md transition-shadow">
            <SectionTitle icon={Star} title="核心特征" />
            <div className="flex flex-wrap gap-2.5">
              {typeData.description.traits.map((trait, idx) => (
                <span key={idx} className="bg-white/80 border border-gray-200/60 px-3 py-1.5 rounded-xl text-gray-700 shadow-sm text-sm font-medium">
                  {trait}
                </span>
              ))}
            </div>
          </div>

          {/* Lucky Colors */}
          <div className="glass-panel rounded-2xl shadow-sm p-8 border border-white/50 hover:shadow-md transition-shadow">
            <SectionTitle icon={Palette} title="幸运色彩" />
            <div className="flex items-center space-x-5 mb-4">
              <div 
                className="w-20 h-20 rounded-2xl shadow-lg border-4 border-white rotate-3 hover:rotate-6 transition-transform"
                style={{ backgroundColor: typeData.luckyColors.primary }}
              ></div>
              <div>
                <span className="block font-bold text-gray-900 text-lg">主要幸运色</span>
                <span className="text-sm text-gray-500 font-mono bg-white/50 px-2 py-0.5 rounded border border-gray-100">{typeData.luckyColors.primary}</span>
              </div>
            </div>
            <p className="text-gray-600 text-sm italic bg-white/40 p-3 rounded-lg border border-white/40">
              “{typeData.luckyColors.meaning}”
            </p>
          </div>

          {/* Careers */}
          <div className="glass-panel rounded-2xl shadow-sm p-8 border border-white/50 md:col-span-2 hover:shadow-md transition-shadow">
            <SectionTitle icon={Briefcase} title="职业发展" />
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {typeData.description.careers.map((career, idx) => (
                <div key={idx} className="flex items-center p-3.5 bg-white/60 rounded-xl border border-white/60 shadow-sm hover:scale-105 transition-transform">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 mr-3 shadow-sm shadow-green-200"></div>
                  <span className="text-gray-700 font-medium">{career}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strengths */}
          <div className="glass-panel rounded-2xl shadow-sm p-8 border border-white/50 hover:shadow-md transition-shadow">
            <SectionTitle icon={TrendingUp} title="优势能力" />
            <ul className="space-y-3">
              {typeData.description.strengths.map((item, idx) => (
                <li key={idx} className="flex items-start bg-green-50/50 p-3 rounded-xl border border-green-100/50">
                  <span className="text-green-600 mr-2.5 font-bold">✓</span>
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="glass-panel rounded-2xl shadow-sm p-8 border border-white/50 hover:shadow-md transition-shadow">
            <SectionTitle icon={AlertCircle} title="潜在盲点" />
            <ul className="space-y-3">
              {typeData.description.weaknesses.map((item, idx) => (
                <li key={idx} className="flex items-start bg-red-50/50 p-3 rounded-xl border border-red-100/50">
                  <span className="text-red-500 mr-2.5 font-bold">!</span>
                  <span className="text-gray-700 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Relationships */}
          <div className="glass-panel rounded-2xl shadow-sm p-8 border border-white/50 md:col-span-2 hover:shadow-md transition-shadow">
            <SectionTitle icon={Heart} title="人际关系" />
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-1.5 h-5 bg-pink-500 rounded-full mr-2"></span>
                  最佳拍档
                </h4>
                <div className="flex gap-3 mb-6 flex-wrap">
                  {typeData.relationships.compatible.map((t) => (
                    <Link key={t} to={`/type/${t}`} className="bg-pink-50 text-pink-700 px-4 py-1.5 rounded-full hover:bg-pink-100 transition-colors font-bold shadow-sm border border-pink-100">
                      {t}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                  <span className="w-1.5 h-5 bg-purple-500 rounded-full mr-2"></span>
                  相处建议
                </h4>
                <p className="text-gray-600 bg-white/60 p-5 rounded-2xl border border-white/60 shadow-inner leading-relaxed">
                  {typeData.relationships.advice}
                </p>
              </div>
            </div>
          </div>

          {/* Development Advice */}
          <div className="glass-panel rounded-2xl shadow-sm p-8 border border-white/50 md:col-span-2 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2.5 bg-green-100/50 rounded-xl mr-3 shadow-sm">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              个人成长建议
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
               <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
                 <h4 className="font-bold text-green-800 mb-4 flex items-center text-lg">
                    <span className="bg-green-200 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">1</span>
                    成长路径
                 </h4>
                 <ul className="space-y-3">
                   {typeData.development.growthPath.map((path, idx) => (
                     <li key={idx} className="flex items-start text-green-800 text-sm">
                       <span className="mr-2.5 mt-1 w-1.5 h-1.5 bg-green-400 rounded-full flex-shrink-0"></span>
                       <span className="leading-relaxed">{path}</span>
                     </li>
                   ))}
                 </ul>
               </div>
               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                 <h4 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
                    <span className="bg-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">2</span>
                    实用技巧
                 </h4>
                 <ul className="space-y-3">
                   {typeData.development.tips.map((tip, idx) => (
                     <li key={idx} className="flex items-start text-blue-800 text-sm">
                       <span className="mr-2.5 mt-1 w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0"></span>
                       <span className="leading-relaxed">{tip}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>
          </div>

          {/* Famous People */}
          <div className="glass-panel rounded-2xl shadow-sm p-8 border border-white/50 md:col-span-2 hover:shadow-md transition-shadow">
             <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="p-2.5 bg-purple-100/50 rounded-xl mr-3 shadow-sm">
                <Star size={20} className="text-purple-600" />
              </div>
              该性格特征的名人代表
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {typeData.famousPeople?.map((person, idx) => (
                <div key={idx} className="text-center p-5 bg-white/60 rounded-2xl hover:bg-white transition-all hover:shadow-md border border-white/60 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full mx-auto mb-3 flex items-center justify-center text-purple-700 font-bold text-xl shadow-sm group-hover:scale-110 transition-transform">
                    {person.name.charAt(0)}
                  </div>
                  <h4 className="font-bold text-gray-900">{person.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{person.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
