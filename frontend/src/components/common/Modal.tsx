import React, { ReactNode } from 'react';
import { C } from '../../data/seedData';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: C.card,
          borderRadius: '22px 22px 0 0',
          padding: '20px 16px',
          width: '100%',
          maxWidth: 430,
          margin: '0 auto',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUp 0.3s ease forwards',
          boxShadow: '0 -4px 24px rgba(0,0,0,0.18)'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16
          }}
        >
          <h3 style={{ margin: 0, fontWeight: 900, color: C.navy, fontSize: 16 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: C.border,
              border: 'none',
              borderRadius: '50%',
              width: 30,
              height: 30,
              cursor: 'pointer',
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: C.navy
            }}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
