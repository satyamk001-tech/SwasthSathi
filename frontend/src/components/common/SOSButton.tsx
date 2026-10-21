import React from 'react';
import { C } from '../../data/seedData';

interface SOSButtonProps {
  onPress: () => void;
}

export const SOSBtn: React.FC<SOSButtonProps> = ({ onPress }) => {
  return (
    <button
      onClick={onPress}
      style={{
        background: C.red,
        color: '#ffffff',
        border: 'none',
        borderRadius: 8,
        padding: '7px 12px',
        fontWeight: 900,
        fontSize: 11,
        cursor: 'pointer',
        animation: 'sosPulse 2s infinite',
        letterSpacing: 0.5,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4
      }}
    >
      🚨 SOS
    </button>
  );
};
