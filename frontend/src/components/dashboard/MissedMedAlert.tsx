import React from 'react';
import { Medication, Member } from '../../types';
import { C } from '../../data/seedData';
import { Card } from '../common/Card';
import { Btn } from '../common/Button';
import { fmtTime } from '../../lib/utils';

interface MissedMedAlertProps {
  missed: Medication[];
  members: Member[];
  onTake: (med: Medication) => void;
  onSkip: (med: Medication) => void;
  onWhatsApp: (member: Member, med: Medication) => void;
}

export const MissedMedAlert: React.FC<MissedMedAlertProps> = ({
  missed,
  members,
  onTake,
  onSkip,
  onWhatsApp
}) => {
  if (missed.length === 0) return null;

  return (
    <Card style={{ borderLeft: `4px solid ${C.red}`, background: C.lRed, marginBottom: 14 }}>
      <p
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: C.red,
          textTransform: 'uppercase',
          letterSpacing: 1,
          marginBottom: 8
        }}
      >
        ⚠️ {missed.length} Missed Medication{missed.length > 1 ? 's' : ''}
      </p>

      {missed.map((med) => {
        const mem = members.find((m) => m.id === med.memberId);
        return (
          <div
            key={med.id}
            style={{
              background: 'rgba(255,255,255,0.7)',
              borderRadius: 10,
              padding: '10px 12px',
              marginBottom: 6
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 7 }}>
              {mem?.name} — {med.name}{' '}
              <span style={{ color: C.muted, fontSize: 11 }}>
                ({fmtTime(med.time)})
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
              <Btn small bg={C.green} onClick={() => onTake(med)}>
                ✅ Take
              </Btn>
              <Btn small bg={C.orange} onClick={() => onSkip(med)}>
                ⏭ Skip
              </Btn>
              {mem?.phone && (
                <Btn small bg="#25D366" onClick={() => onWhatsApp(mem, med)}>
                  📱 WA
                </Btn>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
};
