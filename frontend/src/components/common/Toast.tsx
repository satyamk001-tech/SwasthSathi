import React from 'react';
import { C } from '../../data/seedData';
import { ToastType } from '../../context/AppContext';

interface ToastProps {
  msg: string;
  type?: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ msg, type = 'ok', onClose }) => {
  const bgMap: Record<ToastType, string> = {
    ok: C.green,
    err: C.red,
    warn: C.orange,
    info: C.blue
  };
  const iconMap: Record<ToastType, string> = {
    ok: '✅',
    err: '⚠️',
    warn: '⚡',
    info: 'ℹ️'
  };

  const bg = bgMap[type] || C.green;
  const icon = iconMap[type] || '✅';

  return (
    <div
      style={{
        background: bg,
        color: '#ffffff',
        borderRadius: 12,
        padding: '11px 16px',
        fontSize: 13,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
        animation: 'toastIn 0.3s ease forwards'
      }}
    >
      <span>{icon}</span>
      <span style={{ flex: 1 }}>{msg}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#ffffff',
          cursor: 'pointer',
          fontSize: 18,
          lineHeight: 1,
          padding: 0,
          marginLeft: 8
        }}
      >
        ×
      </button>
    </div>
  );
};
