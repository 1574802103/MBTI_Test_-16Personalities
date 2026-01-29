export interface Option {
  label: string;
  text: string;
  value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
}

export interface QuestionBank {
  quick: Question[];     // 28题，每维度7题
  standard: Question[];  // 93题，每维度约23题
  full: Question[];      // 200题，每维度50题
}

export interface PersonalityType {
  id: string;           // MBTI代码，如："INTJ"
  name: string;         // 中文名称，如："建筑师型"
  category: string;     // 四大类别：分析家、外交家、守护者、探险家
  summary: string;      // 一句话总结
  description: {
    traits: string[];   // 核心性格特征
    strengths: string[]; // 优势能力
    weaknesses: string[]; // 潜在盲点
    careers: string[];  // 适合职业
  };
  luckyColors: {
    primary: string;    // 主要幸运色
    secondary: string[]; // 辅助色彩
    meaning: string;    // 色彩心理学解释
  };
  relationships: {
    compatible: string[]; // 匹配的性格类型
    challenging: string[]; // 有挑战的类型
    advice: string;     // 相处建议
  };
  development: {
    growthPath: string[]; // 成长路径
    tips: string[];     // 发展建议
  };
  famousPeople: {       // 名人代表
    name: string;
    title: string;
  }[];
}

export interface TestResult {
  id: string;
  timestamp: number;
  version: 'quick' | 'standard' | 'full';
  scores: {
    E: number;  // 外向得分
    I: number;  // 内向得分
    S: number;  // 感觉得分
    N: number;  // 直觉得分
    T: number;  // 思考得分
    F: number;  // 情感得分
    J: number;  // 判断得分
    P: number;  // 知觉得分
  };
  resultType: string; // 最终MBTI类型
  dimensions: {
    EI: 'E' | 'I' | 'X'; // X表示中间型
    SN: 'S' | 'N' | 'X';
    TF: 'T' | 'F' | 'X';
    JP: 'J' | 'P' | 'X';
  };
}
