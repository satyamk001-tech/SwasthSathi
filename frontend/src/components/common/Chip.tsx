import React from 'react';
import { C } from '../../data/seedData';

interface ChipProps {
  label: string | number;
  color?: string;
  sm?: boolean;
}

export const Chip: React.FC<ChipProps> = ({ label, color = C.blue, sm = false }) => {
  return (
    <span
      style={{
        background: `${color}20`,
        color,
        borderRadius: 20,
        padding: sm ? '2px 7px' : '3px 10px',
        fontSize: sm ? 10 : 11,
        fontWeight: 700,
        display: 'inline-block',
        whiteSpace: 'nowrap'
      }}
    >
      {label}
    </span>
  );
};
