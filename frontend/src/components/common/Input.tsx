import React, { CSSProperties } from 'react';
import { C } from '../../data/seedData';

interface OptionItem {
  v?: string | number;
  l?: string;
  [key: string]: any;
}

interface InputProps {
  label?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  opts?: (string | OptionItem)[];
  rows?: number;
  min?: string | number;
  max?: string | number;
  style?: CSSProperties;
}

export const Inp: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  opts,
  rows,
  min,
  max,
  style = {}
}) => {
  const commonStyle: CSSProperties = {
    width: '100%',
    padding: '9px 12px',
    borderRadius: 9,
    border: `1.5px solid ${C.border}`,
    fontSize: 13,
    outline: 'none',
    fontFamily: 'inherit',
    background: '#ffffff',
    color: C.text,
    ...style
  };

  return (
    <div style={{ marginBottom: 10 }}>
      {label && (
        <label
          style={{
            display: 'block',
            fontSize: 10,
            fontWeight: 700,
            color: C.muted,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
            marginBottom: 5
          }}
        >
          {label}
        </label>
      )}

      {opts ? (
        <select value={value} onChange={onChange} style={commonStyle}>
          {opts.map((o, idx) => {
            const val = typeof o === 'object' && o !== null ? (o.v !== undefined ? o.v : idx) : o;
            const lbl = typeof o === 'object' && o !== null ? (o.l !== undefined ? o.l : String(o.v)) : o;
            return (
              <option key={idx} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
      ) : rows ? (
        <textarea
          value={value}
          onChange={onChange}
          rows={rows}
          placeholder={placeholder}
          style={{ ...commonStyle, resize: 'none' }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          style={commonStyle}
        />
      )}
    </div>
  );
};
