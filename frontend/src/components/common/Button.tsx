import React, { ReactNode, CSSProperties } from 'react';
import { C } from '../../data/seedData';

interface ButtonProps {
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  bg?: string;
  color?: string;
  outline?: boolean;
  full?: boolean;
  small?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  style?: CSSProperties;
  className?: string;
}

export const Btn: React.FC<ButtonProps> = ({
  children,
  onClick,
  bg,
  color,
  outline = false,
  full = false,
  small = false,
  disabled = false,
  type = 'button',
  style = {},
  className = ''
}) => {
  const baseColor = bg || color || C.navy;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      style={{
        background: outline ? 'transparent' : baseColor,
        color: outline ? baseColor : '#ffffff',
        border: `2px solid ${baseColor}`,
        borderRadius: 10,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'inherit',
        fontWeight: 700,
        opacity: disabled ? 0.5 : 1,
        padding: small ? '5px 12px' : '10px 16px',
        fontSize: small ? 12 : 13,
        width: full ? '100%' : 'auto',
        transition: 'all 0.15s ease-in-out',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        ...style
      }}
    >
      {children}
    </button>
  );
};
