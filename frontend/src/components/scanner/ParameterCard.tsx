import React from 'react';
import { LabParameter } from '../../types';
import { C } from '../../data/seedData';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';

interface ParameterCardProps {
  param: LabParameter;
}

export const ParameterCard: React.FC<ParameterCardProps> = ({ param }) => {
  const statusColor = (s: LabParameter['status']) => {
    switch (s) {
      case 'Normal':
        return C.green;
      case 'Low':
        return C.orange;
      case 'High':
        return C.red;
      case 'Critical':
        return '#7F1D1D';
      default:
        return C.muted;
    }
  };

  const statusBg = (s: LabParameter['status']) => {
    switch (s) {
      case 'Normal':
        return C.lGreen;
      case 'Low':
        return C.lOrange;
      case 'High':
        return C.lRed;
      case 'Critical':
        return '#FEE2E2';
      default:
        return '#F9F9F9';
    }
  };

  const sc = statusColor(param.status);
  const bg = statusBg(param.status);

  return (
    <Card style={{ borderLeft: `4px solid ${sc}`, background: bg, marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: C.text }}>{param.name}</span>
        <Chip label={param.status} color={sc} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 8 }}>
        <div>
          <div
            style={{
              fontSize: 10,
              color: C.muted,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 2
            }}
          >
            Observed Result
          </div>
          <span style={{ fontSize: 24, fontWeight: 900, color: sc }}>{param.result}</span>
          <span style={{ fontSize: 12, color: C.muted }}> {param.unit}</span>
        </div>

        <div>
          <div
            style={{
              fontSize: 10,
              color: C.muted,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 2
            }}
          >
            Normal Range
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{param.normalRange}</span>
          <span style={{ fontSize: 12, color: C.muted }}> {param.unit}</span>
        </div>
      </div>

      {param.explanation && (
        <div style={{ fontSize: 12, color: C.text, marginBottom: 4 }}>
          ℹ️ {param.explanation}
        </div>
      )}

      {param.suggestion && (
        <div style={{ fontSize: 12, color: C.text }}>
          💡 {param.suggestion}
        </div>
      )}
    </Card>
  );
};
