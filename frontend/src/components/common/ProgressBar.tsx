import React from 'react';
import { C } from '../../data/seedData';

interface ProgressBarProps {
  v: number;
  max?: number;
  color?: string;
  h?: number;
}

export const Bar: React.FC<ProgressBarProps> = ({ v, max = 100, color = C.blue, h = 6 }) => {
  const percentage = Math.min(100, Math.max(0, Math.round((v / max) * 100)));

  return (
    <div style={{ background: C.border, borderRadius: 99, height: h, overflow: 'hidden' }}>
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          background: color,
          borderRadius: 99,
          transition: 'width 0.4s ease-in-out'
        }}
      />
    </div>
  );
};
