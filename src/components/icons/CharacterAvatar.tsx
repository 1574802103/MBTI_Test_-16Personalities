import React from 'react';
import { motion, type Variants } from 'framer-motion';

export interface CharacterAvatarProps {
  type: string;
  size?: number | string;
  className?: string;
  animate?: boolean;
}

// 基础颜色定义 - 对应四大类型
const COLORS = {
  analyst: { // 紫色系 - INTJ, INTP, ENTJ, ENTP
    primary: '#8b5cf6', // violet-500
    secondary: '#7c3aed', // violet-600
    light: '#ddd6fe', // violet-200
    skin: '#fde68a', // amber-100 (skin tone)
    hair: '#4c1d95', // violet-900
    accent: '#c4b5fd', // violet-300
    clothing: '#5b21b6', // violet-800
  },
  diplomat: { // 绿色系 - INFJ, INFP, ENFJ, ENFP
    primary: '#10b981', // emerald-500
    secondary: '#059669', // emerald-600
    light: '#a7f3d0', // emerald-200
    skin: '#fecaca', // red-100 (rosy skin tone)
    hair: '#064e3b', // emerald-900
    accent: '#6ee7b7', // emerald-300
    clothing: '#047857', // emerald-700
  },
  sentinel: { // 蓝色系 - ISTJ, ISFJ, ESTJ, ESFJ
    primary: '#3b82f6', // blue-500
    secondary: '#2563eb', // blue-600
    light: '#bfdbfe', // blue-200
    skin: '#ffedd5', // orange-100
    hair: '#1e3a8a', // blue-900
    accent: '#93c5fd', // blue-300
    clothing: '#1d4ed8', // blue-700
  },
  explorer: { // 黄色系 - ISTP, ISFP, ESTP, ESFP
    primary: '#f59e0b', // amber-500
    secondary: '#d97706', // amber-600
    light: '#fde68a', // amber-200
    skin: '#fed7aa', // orange-200 (tan)
    hair: '#78350f', // amber-900
    accent: '#fcd34d', // amber-300
    clothing: '#b45309', // amber-700
  }
};

const getCategory = (type: string) => {
  const t = type.toUpperCase();
  if (['INTJ', 'INTP', 'ENTJ', 'ENTP'].includes(t)) return 'analyst';
  if (['INFJ', 'INFP', 'ENFJ', 'ENFP'].includes(t)) return 'diplomat';
  if (['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'].includes(t)) return 'sentinel';
  return 'explorer';
};

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ type, size = 120, className = '', animate = true }) => {
  const category = getCategory(type);
  const c = COLORS[category as keyof typeof COLORS];
  const t = type.toUpperCase();

  // 身体动画
  const bodyVariants: Variants = {
    hover: {
      y: -3,
      rotate: [0, -1, 1, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: [0.42, 0, 0.58, 1]
      }
    }
  };
  
  // 眼睛动画 (眨眼)
  const eyeVariants = {
    initial: { scaleY: 1 },
    blink: { 
      scaleY: [1, 0.1, 1],
      transition: { 
        duration: 0.25, 
        repeat: Infinity, 
        repeatDelay: Math.random() * 4 + 2 
      }
    }
  };

  // 渲染具体角色的特征
  const renderCharacterDetails = () => {
    switch(t) {
      // --- Analysts (Purple) ---
      case 'INTJ': // Architect: Strict, blueprint, glasses, mustache?
        return (
          <>
            {/* Clothing: Suit */}
            <path d="M25 80 L 25 100 L 75 100 L 75 80 C 75 65 25 65 25 80" fill={c.clothing} />
            <path d="M40 80 L 50 90 L 60 80 L 50 100 Z" fill="white" opacity="0.2" /> {/* Tie area */}
            <path d="M48 80 L 50 100 L 52 80 Z" fill={c.primary} /> {/* Tie */}
            
            {/* Head */}
            <circle cx="50" cy="45" r="19" fill={c.skin} />
            
            {/* Hair: Neat side part */}
            <path d="M30 40 C 30 20 70 20 70 40 C 70 50 65 50 65 40 C 65 25 35 25 35 40 Z" fill={c.hair} />
            <path d="M30 40 C 28 45 28 50 32 45" fill={c.hair} />

            {/* Glasses */}
            <circle cx="43" cy="46" r="4" stroke="#333" strokeWidth="1.5" fill="none" />
            <circle cx="57" cy="46" r="4" stroke="#333" strokeWidth="1.5" fill="none" />
            <line x1="47" y1="46" x2="53" y2="46" stroke="#333" strokeWidth="1.5" />

            {/* Beard/Moustache */}
            <path d="M45 58 Q 50 62 55 58" stroke={c.hair} strokeWidth="2" fill="none" />

            {/* Prop: Blueprint Scroll */}
            <rect x="65" y="65" width="20" height="25" rx="2" fill="white" stroke={c.secondary} strokeWidth="1" transform="rotate(-10 65 65)" />
            <line x1="68" y1="70" x2="80" y2="70" stroke={c.secondary} strokeWidth="1" transform="rotate(-10 65 65)" />
            <line x1="68" y1="75" x2="78" y2="75" stroke={c.secondary} strokeWidth="1" transform="rotate(-10 65 65)" />
          </>
        );
      
      case 'INTP': // Logician: Lab coat, messy hair, flask
        return (
          <>
            {/* Clothing: Lab coat */}
            <path d="M25 80 L 25 100 L 75 100 L 75 80 C 75 65 25 65 25 80" fill="white" stroke="#e2e8f0" strokeWidth="1" />
            <path d="M50 65 L 50 100" stroke="#cbd5e1" strokeWidth="1" />
            
            {/* Head */}
            <circle cx="50" cy="45" r="19" fill={c.skin} />
            
            {/* Hair: Messy */}
            <path d="M25 45 C 20 30 30 15 50 15 C 70 15 80 30 75 45 C 75 55 65 50 65 40 C 65 25 35 25 35 40 C 35 50 25 55 25 45 Z" fill={c.hair} />

            {/* Prop: Flask */}
            <path d="M70 70 L 70 65 L 76 65 L 76 70 L 82 85 L 64 85 Z" fill={c.accent} stroke={c.primary} strokeWidth="1" />
            <circle cx="73" cy="78" r="2" fill="white" opacity="0.6" />
          </>
        );

      case 'ENTJ': // Commander: Sharp suit, pointer
        return (
          <>
             {/* Clothing: Sharp Suit with raised collar */}
             <path d="M20 75 L 20 100 L 80 100 L 80 75 C 80 60 20 60 20 75" fill={c.clothing} />
             <path d="M50 60 L 35 75 L 50 90 L 65 75 Z" fill="white" />
             <path d="M50 75 L 50 95" stroke={c.primary} strokeWidth="3" />

             {/* Head */}
             <circle cx="50" cy="42" r="19" fill={c.skin} />
             
             {/* Hair: Slicked back */}
             <path d="M30 40 C 30 25 70 25 70 40 L 70 50 L 30 50 Z" fill={c.hair} />

             {/* Eyebrows: Angry/Determine */}
             <line x1="38" y1="38" x2="45" y2="40" stroke={c.hair} strokeWidth="2" />
             <line x1="55" y1="40" x2="62" y2="38" stroke={c.hair} strokeWidth="2" />

             {/* Prop: Pointer/Cane */}
             <line x1="75" y1="60" x2="75" y2="100" stroke="#4a044e" strokeWidth="3" />
             <circle cx="75" cy="60" r="3" fill="#fbbf24" />
          </>
        );

      case 'ENTP': // Debater: Smirk, raised eyebrow, stylish jacket
        return (
          <>
             {/* Clothing: Stylish Jacket */}
             <path d="M25 75 L 25 100 L 75 100 L 75 75 C 75 60 25 60 25 75" fill={c.clothing} />
             <path d="M50 60 L 50 100" stroke={c.accent} strokeWidth="2" />

             {/* Head */}
             <circle cx="50" cy="45" r="19" fill={c.skin} />

             {/* Hair: Asymmetric/Wild */}
             <path d="M28 45 C 25 20 65 15 75 35 C 78 45 70 50 65 45 C 60 30 40 30 35 45 Z" fill={c.hair} />

             {/* Face: Smirk & Eyebrow */}
             <path d="M45 55 Q 50 58 55 53" stroke="#333" strokeWidth="1.5" fill="none" />
             <path d="M38 38 Q 42 35 46 38" stroke={c.hair} strokeWidth="1.5" fill="none" /> {/* Raised */}
             <path d="M54 38 Q 58 40 62 38" stroke={c.hair} strokeWidth="1.5" fill="none" /> {/* Normal */}
          </>
        );

      // --- Diplomats (Green) ---
      case 'INFJ': // Advocate: Wise, robes, staff/orb
        return (
          <>
             {/* Clothing: Robes */}
             <path d="M25 70 L 15 100 L 85 100 L 75 70 C 70 55 30 55 25 70" fill={c.clothing} />
             <path d="M50 55 L 50 100" stroke={c.accent} strokeWidth="1" />

             {/* Head */}
             <circle cx="50" cy="42" r="18" fill={c.skin} />

             {/* Hair: Long straight gentle */}
             <path d="M30 40 C 30 20 70 20 70 40 L 75 80 L 25 80 L 30 40 Z" fill={c.hair} />
             
             {/* Prop: Glowing Orb */}
             <circle cx="75" cy="75" r="6" fill="white" className="animate-pulse" />
             <circle cx="75" cy="75" r="8" stroke="white" strokeWidth="1" opacity="0.5" className="animate-ping" />
          </>
        );

      case 'INFP': // Mediator: Flower crown, flowy
        return (
          <>
             {/* Clothing: Tunic */}
             <path d="M30 75 L 20 100 L 80 100 L 70 75 C 65 60 35 60 30 75" fill={c.accent} />
             
             {/* Head */}
             <circle cx="50" cy="45" r="18" fill={c.skin} />

             {/* Hair: Wavy with flowers */}
             <path d="M28 45 C 25 25 75 25 72 45 C 75 60 80 80 70 85 C 60 70 40 70 30 85 C 20 80 25 60 28 45 Z" fill={c.hair} />
             {/* Flowers */}
             <circle cx="35" cy="35" r="3" fill="#f472b6" />
             <circle cx="65" cy="35" r="3" fill="#f472b6" />

             {/* Prop: Butterfly (simplified) */}
             <path d="M75 65 L 80 60 L 85 65 L 80 70 Z" fill="#fcd34d" />
          </>
        );

      case 'ENFJ': // Protagonist: Sword/Heart, Heroic
        return (
          <>
             {/* Clothing: Armor-like/Heroic */}
             <path d="M25 75 L 20 100 L 80 100 L 75 75 C 70 60 30 60 25 75" fill={c.clothing} />
             <path d="M30 75 L 50 90 L 70 75" fill="none" stroke={c.accent} strokeWidth="2" />

             {/* Head */}
             <circle cx="50" cy="42" r="18" fill={c.skin} />

             {/* Hair: Flowing back */}
             <path d="M30 40 C 25 25 75 25 70 40 L 75 70 L 25 70 L 30 40 Z" fill={c.hair} />

             {/* Prop: Sword Hilt / Torch */}
             <rect x="70" y="60" width="4" height="30" fill="#9ca3af" />
             <rect x="65" y="65" width="14" height="4" fill="#4b5563" />
          </>
        );
      
      case 'ENFP': // Campaigner: Fun hat/hair, balloons
        return (
          <>
             {/* Clothing: Colorful */}
             <path d="M30 75 L 20 100 L 80 100 L 70 75 C 65 60 35 60 30 75" fill={c.primary} />
             <circle cx="40" cy="85" r="3" fill="white" opacity="0.5" />
             <circle cx="60" cy="90" r="3" fill="white" opacity="0.5" />

             {/* Head */}
             <circle cx="50" cy="45" r="18" fill={c.skin} />

             {/* Hair: Messy Short */}
             <path d="M25 45 C 20 20 80 20 75 45 L 75 60 L 25 60 Z" fill={c.hair} />
             
             {/* Prop: Balloon */}
             <line x1="75" y1="70" x2="75" y2="90" stroke="#333" strokeWidth="1" />
             <circle cx="75" cy="65" r="8" fill="#f87171" opacity="0.9" />
             <circle cx="77" cy="62" r="2" fill="white" opacity="0.5" />
          </>
        );

      // --- Sentinels (Blue) ---
      case 'ISTJ': // Logistician: Glasses, clipboard, neat
        return (
          <>
             {/* Clothing: Shirt and Tie */}
             <path d="M25 80 L 25 100 L 75 100 L 75 80 C 75 65 25 65 25 80" fill="white" stroke="#94a3b8" />
             <path d="M50 65 L 50 100" stroke="#94a3b8" strokeWidth="1" />
             <path d="M48 65 L 50 85 L 52 65 Z" fill={c.clothing} />

             {/* Head */}
             <circle cx="50" cy="42" r="19" fill={c.skin} />

             {/* Hair: Short neat */}
             <path d="M30 35 C 30 20 70 20 70 35 L 70 50 L 30 50 Z" fill={c.hair} />

             {/* Glasses */}
             <rect x="38" y="40" width="10" height="6" rx="1" stroke="#333" strokeWidth="1" fill="none" />
             <rect x="52" y="40" width="10" height="6" rx="1" stroke="#333" strokeWidth="1" fill="none" />
             <line x1="48" y1="43" x2="52" y2="43" stroke="#333" strokeWidth="1" />

             {/* Prop: Clipboard */}
             <rect x="15" y="65" width="20" height="25" fill="#e2e8f0" stroke="#64748b" strokeWidth="1" transform="rotate(10 15 65)" />
             <line x1="18" y1="70" x2="30" y2="72" stroke="#64748b" strokeWidth="1" />
             <line x1="18" y1="75" x2="30" y2="77" stroke="#64748b" strokeWidth="1" />
          </>
        );

      case 'ISFJ': // Defender: Nurse/Caregiver, gentle
        return (
          <>
             {/* Clothing: Scrub/Uniform */}
             <path d="M25 75 L 20 100 L 80 100 L 75 75 C 70 60 30 60 25 75" fill={c.light} />
             <rect x="45" y="80" width="10" height="10" fill="white" opacity="0.6" />
             <rect x="48" y="82" width="4" height="6" fill="#ef4444" /> {/* Cross */}
             <rect x="47" y="83" width="6" height="4" fill="#ef4444" />

             {/* Head */}
             <circle cx="50" cy="42" r="18" fill={c.skin} />

             {/* Hair: Bun */}
             <circle cx="50" cy="25" r="8" fill={c.hair} />
             <path d="M30 35 C 30 20 70 20 70 35 L 70 55 L 30 55 Z" fill={c.hair} />
          </>
        );

      case 'ESTJ': // Executive: Suit, gavel, stern
        return (
          <>
             {/* Clothing: Suit */}
             <path d="M20 75 L 20 100 L 80 100 L 80 75 C 80 60 20 60 20 75" fill={c.clothing} />
             <path d="M50 60 L 40 70 L 50 80 L 60 70 Z" fill="white" />

             {/* Head */}
             <circle cx="50" cy="42" r="19" fill={c.skin} />

             {/* Hair: Very short/Receding */}
             <path d="M30 40 C 30 25 70 25 70 40 L 70 45 L 30 45 Z" fill={c.hair} />

             {/* Prop: Gavel */}
             <rect x="70" y="60" width="20" height="10" fill="#78350f" transform="rotate(-15 70 60)" />
             <rect x="78" y="65" width="4" height="25" fill="#92400e" transform="rotate(-15 70 60)" />
          </>
        );

      case 'ESFJ': // Consul: Welcoming, tray
        return (
          <>
             {/* Clothing: Apron/Vest */}
             <path d="M30 75 L 20 100 L 80 100 L 70 75 C 65 60 35 60 30 75" fill={c.primary} />
             <path d="M35 75 L 65 75 L 60 100 L 40 100 Z" fill="white" opacity="0.3" />

             {/* Head */}
             <circle cx="50" cy="45" r="18" fill={c.skin} />

             {/* Hair: Styled Bob */}
             <path d="M25 40 C 25 20 75 20 75 40 L 80 65 L 20 65 Z" fill={c.hair} />

             {/* Prop: Cake/Tray */}
             <rect x="65" y="75" width="20" height="2" fill="#94a3b8" />
             <rect x="70" y="65" width="10" height="10" fill="#f472b6" rx="2" />
          </>
        );

      // --- Explorers (Yellow) ---
      case 'ISTP': // Virtuoso: Goggles, wrench, vest
        return (
          <>
             {/* Clothing: Vest/Overalls */}
             <path d="M25 75 L 25 100 L 75 100 L 75 75 C 75 60 25 60 25 75" fill={c.clothing} />
             <path d="M35 75 L 35 100" stroke="#78350f" strokeWidth="2" />
             <path d="M65 75 L 65 100" stroke="#78350f" strokeWidth="2" />

             {/* Head */}
             <circle cx="50" cy="45" r="19" fill={c.skin} />

             {/* Hair: Cap backwards? or just messy */}
             <path d="M25 40 C 25 25 75 25 75 40 L 75 55 L 25 55 Z" fill={c.hair} />
             
             {/* Goggles on head */}
             <rect x="35" y="30" width="12" height="8" rx="2" fill="#3b82f6" stroke="#1e293b" strokeWidth="2" />
             <rect x="53" y="30" width="12" height="8" rx="2" fill="#3b82f6" stroke="#1e293b" strokeWidth="2" />
             <line x1="25" y1="34" x2="35" y2="34" stroke="#1e293b" strokeWidth="2" />
             <line x1="65" y1="34" x2="75" y2="34" stroke="#1e293b" strokeWidth="2" />

             {/* Prop: Wrench */}
             <path d="M75 70 L 85 80" stroke="#94a3b8" strokeWidth="4" />
             <circle cx="75" cy="70" r="4" stroke="#94a3b8" strokeWidth="2" fill="none" />
          </>
        );

      case 'ISFP': // Adventurer: Beret, palette
        return (
          <>
             {/* Clothing: Paint splattered shirt */}
             <path d="M30 75 L 20 100 L 80 100 L 70 75 C 65 60 35 60 30 75" fill={c.light} />
             <circle cx="40" cy="80" r="2" fill="#ef4444" />
             <circle cx="50" cy="90" r="3" fill="#3b82f6" />
             <circle cx="60" cy="85" r="2" fill="#eab308" />

             {/* Head */}
             <circle cx="50" cy="45" r="18" fill={c.skin} />

             {/* Hair: Long Artsy */}
             <path d="M25 45 C 20 60 30 80 25 90 L 75 90 C 70 80 80 60 75 45 C 75 30 25 30 25 45" fill={c.hair} />

             {/* Prop: Palette */}
             <ellipse cx="75" cy="75" rx="10" ry="8" fill="#d97706" />
             <circle cx="72" cy="73" r="2" fill="#ef4444" />
             <circle cx="78" cy="73" r="2" fill="#3b82f6" />
             <circle cx="75" cy="78" r="2" fill="#22c55e" />
          </>
        );

      case 'ESTP': // Entrepreneur: Sunglasses, leather jacket
        return (
          <>
             {/* Clothing: Jacket with collar */}
             <path d="M20 75 L 20 100 L 80 100 L 80 75 C 80 60 20 60 20 75" fill="#1f2937" />
             <path d="M50 60 L 50 100" stroke="#374151" strokeWidth="1" />
             <path d="M50 60 L 40 70 L 50 80 L 60 70 Z" fill="white" />

             {/* Head */}
             <circle cx="50" cy="45" r="19" fill={c.skin} />

             {/* Hair: Spiky */}
             <path d="M25 45 L 30 25 L 40 40 L 50 20 L 60 40 L 70 25 L 75 45 Z" fill={c.hair} />

             {/* Sunglasses */}
             <path d="M35 45 L 48 45 L 48 52 C 48 55 35 55 35 52 Z" fill="black" />
             <path d="M52 45 L 65 45 L 65 52 C 65 55 52 55 52 52 Z" fill="black" />
             <line x1="48" y1="46" x2="52" y2="46" stroke="black" strokeWidth="1" />
          </>
        );

      case 'ESFP': // Entertainer: Mic, star
        return (
          <>
             {/* Clothing: Sparkly */}
             <path d="M30 75 L 20 100 L 80 100 L 70 75 C 65 60 35 60 30 75" fill={c.primary} />
             <path d="M40 80 L 42 85 L 38 85 Z" fill="white" /> {/* Star shape hint */}
             <path d="M60 90 L 62 95 L 58 95 Z" fill="white" />

             {/* Head */}
             <circle cx="50" cy="45" r="18" fill={c.skin} />

             {/* Hair: Voluminous */}
             <path d="M25 45 C 15 30 85 30 75 45 L 80 70 C 80 80 20 80 20 70 Z" fill={c.hair} />

             {/* Prop: Microphone */}
             <line x1="75" y1="65" x2="75" y2="80" stroke="#333" strokeWidth="3" />
             <circle cx="75" cy="65" r="4" fill="#64748b" />
          </>
        );

      default:
        return (
           <>
             {/* Generic Body */}
             <path d="M30 80 C 30 65, 70 65, 70 80 L 80 100 L 20 100 Z" fill={c.primary} />
             <circle cx="50" cy="45" r="18" fill={c.skin} />
             <circle cx="50" cy="40" r="22" fill={c.hair} />
           </>
        );
    }
  };

  // 通用面部特征 (如果没有被特定角色覆盖)
  const renderFace = () => {
    // 墨镜角色不需要眼睛
    if (['ESTP'].includes(t)) return null;

    return (
      <motion.g variants={animate ? eyeVariants : undefined} initial="initial" animate="blink">
        <circle cx="43" cy="45" r="2.5" fill="#1e293b" />
        <circle cx="57" cy="45" r="2.5" fill="#1e293b" />
        {/* Eye shine */}
        <circle cx="44" cy="44" r="0.8" fill="white" />
        <circle cx="58" cy="44" r="0.8" fill="white" />
      </motion.g>
    );
  };

  // 通用嘴巴
  const renderMouth = () => {
    // T型通常严肃，F型通常微笑
    if (t.includes('T')) {
      return <path d="M45 56 L 55 56" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" />;
    } else {
      return <path d="M45 55 Q 50 60 55 55" stroke="#1e293b" strokeWidth="1.5" strokeLinecap="round" fill="none" />;
    }
  };

  return (
    <motion.svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={animate ? "hover" : undefined}
      variants={bodyVariants}
    >
      {/* 背景光环 */}
      <circle cx="50" cy="50" r="48" fill={c.light} opacity="0.6" />
      
      {/* 角色特定层 */}
      {renderCharacterDetails()}
      
      {/* 面部 (位于最上层) */}
      {renderFace()}
      {renderMouth()}
      
    </motion.svg>
  );
};
