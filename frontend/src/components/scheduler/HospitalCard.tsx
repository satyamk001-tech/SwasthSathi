import React from 'react';
import { Hospital } from '../../types';
import { C } from '../../data/seedData';
import { Card } from '../common/Card';
import { Btn } from '../common/Button';
import { Chip } from '../common/Chip';
import { fmtTime } from '../../lib/utils';

interface HospitalCardProps {
  hospital: Hospital;
  sosMode: boolean;
  selectedSlot?: string;
  bookedSlot?: string;
  onSelectSlot: (hospitalId: string, slot: string) => void;
  onBook: (hospital: Hospital) => void;
}

export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  sosMode,
  selectedSlot,
  bookedSlot,
  onSelectSlot,
  onBook
}) => {
  return (
    <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
      {/* Top Banner */}
      <div
        style={{
          background: `linear-gradient(135deg, ${C.navy}f0, ${C.blue}90)`,
          padding: '12px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: 38 }}>{hospital.emoji}</span>
        <div style={{ textAlign: 'right' }}>
          <div style={{ color: '#fff', fontWeight: 700 }}>⭐ {hospital.rating}</div>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 11 }}>
            📍 {hospital.dist} km away
          </div>
          {sosMode && (
            <div
              style={{
                color: hospital.erBeds > 0 ? '#6EE7B7' : '#FCA5A5',
                fontWeight: 700,
                fontSize: 11
              }}
            >
              🛏 {hospital.erBeds} ER Beds Available
            </div>
          )}
        </div>
      </div>

      {/* Hospital Info & Slots */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{ fontWeight: 800, fontSize: 14, color: C.text, marginBottom: 5 }}>
          {hospital.name}
        </div>

        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
          {hospital.tags.map((t) => (
            <Chip key={t} label={t} color={C.navy} />
          ))}
        </div>

        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: C.muted,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 5
            }}
          >
            Available Slots{' '}
            <span style={{ color: C.green, textTransform: 'none', fontWeight: 600 }}>
              (⭐ = least crowded)
            </span>
          </div>

          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {hospital.slots.map((s) => {
              const isSelected = selectedSlot === s;
              const isQuiet = s === hospital.quiet;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onSelectSlot(hospital.id, s)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 7,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: `1.5px solid ${isSelected ? C.blue : C.border}`,
                    background: isSelected ? C.blue : isQuiet ? C.lGreen : '#ffffff',
                    color: isSelected ? '#ffffff' : isQuiet ? C.green : C.text,
                    transition: 'all 0.15s ease'
                  }}
                >
                  {fmtTime(s)}
                  {isQuiet ? ' ⭐' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: 8 }}>
          {bookedSlot ? (
            <div
              style={{
                background: C.lGreen,
                borderRadius: 9,
                padding: '9px',
                textAlign: 'center',
                fontWeight: 700,
                color: C.green,
                fontSize: 12
              }}
            >
              ✅ Booked ({fmtTime(bookedSlot)})
            </div>
          ) : (
            <Btn full bg={sosMode ? C.red : C.blue} onClick={() => onBook(hospital)}>
              {sosMode ? '🚑 Book ER Queue' : '📅 Book Appointment'}
            </Btn>
          )}

          <Btn
            bg={C.orange}
            onClick={() => window.open(`https://maps.google.com/?q=${hospital.lat},${hospital.lng}`)}
          >
            🗺
          </Btn>
          <Btn outline color={C.navy} onClick={() => window.open(`tel:${hospital.phone}`)}>
            📞
          </Btn>
        </div>
      </div>
    </Card>
  );
};
