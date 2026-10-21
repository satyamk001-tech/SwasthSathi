import React from 'react';
import { C } from '../../data/seedData';

interface SpinnerProps {
  color?: string;
  size?: number;
}

export const Spin: React.FC<SpinnerProps> = ({ color = C.blue, size = 6 }) => {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: color,
            animation: `bounce 1.1s ${i * 0.18}s infinite ease-in-out`,
            display: 'inline-block'
          }}
        />
      ))}
    </span>
  );
};
