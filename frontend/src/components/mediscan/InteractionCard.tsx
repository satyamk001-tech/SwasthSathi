import React from 'react';
import { C } from '../../data/seedData';
import { Card } from '../common/Card';
import { Chip } from '../common/Chip';

interface InteractionCardProps {
  sev: 'Major' | 'Moderate' | 'Minor';
  drugs?: string[];
  why?: string;
  mechanism?: string;
  management?: string;
  alternatives?: string[];
}

export const InteractionCard: React.FC<InteractionCardProps> = ({
  sev,
  drugs,
  why,
  mechanism,
  management,
  alternatives
}) => {
  const sevColor = sev === 'Major' ? C.red : sev === 'Moderate' ? C.orange : C.blue;
  const sevBg = sev === 'Major' ? C.lRed : C.lOrange;

  return (
    <Card style={{ borderLeft: `4px solid ${sevColor}`, background: sevBg, marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <span style={{ fontWeight: 900, color: sevColor, fontSize: 13 }}>
          ⚠️ {sev.toUpperCase()} INTERACTION
        </span>
        {drugs && drugs.length > 0 && (
          <span style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>
            {drugs.join(' + ')}
          </span>
        )}
      </div>

      {why && (
        <div style={{ fontSize: 12, marginBottom: 5 }}>
          <b>Clinical Risk:</b> {why}
        </div>
      )}

      {mechanism && (
        <div style={{ fontSize: 12, marginBottom: 4 }}>
          <b>Biological Mechanism:</b> {mechanism}
        </div>
      )}

      {management && (
        <div
          style={{
            fontSize: 12,
            marginBottom: 6,
            background: 'rgba(255,255,255,0.65)',
            borderRadius: 6,
            padding: '6px 8px'
          }}
        >
          <b>Management Guidance:</b> {management}
        </div>
      )}

      {alternatives && alternatives.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.green }}>Safe Alternatives:</span>
          {alternatives.map((a, j) => (
            <Chip key={j} label={a} color={C.green} />
          ))}
        </div>
      )}
    </Card>
  );
};
