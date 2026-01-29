import React from 'react';
import { Layout } from '../components/Layout';

export const About: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-8 text-gray-700">
        <h1 className="text-3xl font-bold text-gray-900">关于 MBTI</h1>
        
        <div className="prose prose-blue max-w-none">
          <p>
            MBTI（Myers-Briggs Type Indicator）是一种迫选型、自我报告式的性格评估工具，
            用以衡量和描述人们在获取信息、做出决策、对待生活等方面的心理活动规律和性格类型。
          </p>

          <p>
            本应用为非官方自测工具，基于公开的类型理论做题目与计分实现；结果仅供自我探索与参考，不能替代专业测评与心理咨询。
          </p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">四个维度</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>外向 (E) vs 内向 (I)</strong>：能量来源。你是从与人交往中获取能量，还是通过独处恢复精力？</li>
            <li><strong>感觉 (S) vs 直觉 (N)</strong>：信息获取。你更关注具体的事实和细节，还是更关注抽象的概念和可能性？</li>
            <li><strong>思考 (T) vs 情感 (F)</strong>：决策方式。你做决定时更看重逻辑和客观分析，还是更看重价值观和他人感受？</li>
            <li><strong>判断 (J) vs 知觉 (P)</strong>：生活方式。你喜欢有计划、有条理的生活，还是喜欢灵活、随性的生活？</li>
          </ul>
          
          <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">16种人格类型</h2>
          <p>
            通过这四个维度的组合，MBTI将人分为16种不同的人格类型。每种类型都有其独特的优势、盲点和发展潜力。
            了解自己的人格类型，可以帮助我们更好地认识自己，发挥长处，改善人际关系，并找到适合自己的职业发展方向。
          </p>
        </div>
      </div>
    </Layout>
  );
};
