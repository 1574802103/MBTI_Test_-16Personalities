import React from 'react';
import { CharacterAvatar } from './CharacterAvatar';

export interface TypeIconProps extends React.SVGProps<SVGSVGElement> {
  type: string;
  size?: number | string;
  color?: string;
  className?: string;
}

export const TypeIcon: React.FC<TypeIconProps> = ({ type, size = 48, className = '' }) => {
  return <CharacterAvatar type={type} size={size} className={className} />;
};
