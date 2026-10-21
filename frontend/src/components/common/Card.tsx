import React, { ReactNode, CSSProperties } from 'react';
import { C } from '../../data/seedData';

interface CardProps {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Card: React.FC<CardProps> = ({ children, style = {}, className = '', onClick }) => {
  return (
    <div
      onClick={onClick}
      className={className}
      style={{
        background: C.card,
        borderRadius: 16,
        padding: 14,
        boxShadow: '0 1px 6px rgba(11,30,61,0.07)',
        marginBottom: 10,
        ...style
      }}
    >
      {children}
    </div>
  );
};
