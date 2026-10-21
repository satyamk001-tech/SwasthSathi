import React, { useState } from 'react';
import { Member, Medication, Vital, Appointment, DietPlan, AppointmentPrep } from '../../types';
import { C } from '../../data/seedData';
import { Card } from '../common/Card';
import { Btn } from '../common/Button';
import { Chip } from '../common/Chip';
import { Bar } from '../common/ProgressBar';
import { Spin } from '../common/Spinner';
import { DietPlanCard } from './DietPlanCard';
import { generateDietPlan, generateAppointmentPrep } from '../../lib/aiService';
import { fmtDate, fmtTime } from '../../lib/utils';
import { useApp } from '../../context/AppContext';

interface MemberCardProps {
  member: Member;
  medications: Medication[];
  vitals: Vital[];
  appointments: Appointment[];
  onEditMember: (m: Member) => void;
  onDeleteMember: (id: string) => void;
  onOpenVitalModal: (memberId: string) => void;
  onOpenMedModal: (memberId: string) => void;
  onOpenApptModal: (memberId: string) => void;
  onMarkMedTaken: (med: Medication) => void;
  onSkipMed: (med: Medication) => void;
  onDeleteMed: (id: string) => void;
  onCancelAppt: (id: string) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  medications,
  vitals,
  appointments,
  onEditMember,
  onDeleteMember,
  onOpenVitalModal,
  onOpenMedModal,
  onOpenApptModal,
  onMarkMedTaken,
  onSkipMed,
  onDeleteMed,
  onCancelAppt
}) => {
  const { toast } = useApp();
  const [diet, setDiet] = useState<DietPlan | null>(null);
  const [dietLoading, setDietLoading] = useState(false);
  const [apptPrep, setApptPrep] = useState<Record<string, AppointmentPrep>>({});
  const [prepLoading, setPrepLoading] = useState<Record<string, boolean>>({});

  // Calculate Adherence
  const scheduledMeds = medications.filter((m) => m.freq !== 'As Needed');
  const adherence = scheduledMeds.length
    ? Math.round(
        (scheduledMeds.filter((m) => m.taken === true).length / scheduledMeds.length) * 100
      )
    : 100;

  const handleGenerateDiet = async () => {
    setDietLoading(true);
    try {
      const plan = await generateDietPlan(member);
      setDiet(plan);
      toast(`Diet plan ready for ${member.name.split(' ')[0]}!`);
    } catch (e: any) {
      toast(e.message || 'Failed to generate diet', 'err');
    } finally {
      setDietLoading(false);
    }
  };

  const handleGenerateQuestions = async (appt: Appointment) => {
    setPrepLoading((prev) => ({ ...prev, [appt.id]: true }));
    try {
      const prep = await generateAppointmentPrep(member, appt);
      setApptPrep((prev) => ({ ...prev, [appt.id]: prep }));
      toast(`Questions prepared for ${appt.doctor}!`);
    } catch (e: any) {
      toast(e.message || 'Failed to generate questions', 'err');
    } finally {
      setPrepLoading((prev) => ({ ...prev, [appt.id]: false }));
    }
  };

  return (
    <Card style={{ border: `1.5px solid ${member.color}25`, marginBottom: 16 }}>
      {/* Header Profile */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            background: `${member.color}20`,
            color: member.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: 22,
            flexShrink: 0
          }}
        >
          {member.avatar || member.name[0]}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 800, fontSize: 15, color: C.text, wordBreak: 'break-word' }}>
            {member.name}
          </div>
          <div style={{ fontSize: 11, color: C.muted, marginBottom: 4 }}>
            {member.age}y · {member.role}
            {member.blood ? ` · 🩸${member.blood}` : ''}
          </div>
          <Bar v={adherence} color={adherence >= 80 ? C.green : adherence >= 50 ? C.orange : C.red} h={4} />
          <div style={{ fontSize: 10, color: C.muted, marginTop: 2 }}>
            Medication Adherence: {adherence}%
          </div>
        </div>

        <div style={{ display: 'flex', gap: 5, flexShrink: 0 }}>
          <Btn small outline color={member.color} onClick={() => onEditMember(member)}>
            ✏️
          </Btn>
          <Btn small outline color={C.red} onClick={() => onDeleteMember(member.id)}>
            🗑
          </Btn>
        </div>
      </div>

      {/* Conditions */}
      {member.conditions && member.conditions.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: C.muted,
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 5
            }}
          >
            Health Profile
          </div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {member.conditions.map((c) => (
              <Chip key={c} label={c} color={member.color} />
            ))}
          </div>
        </div>
      )}

      {/* Vitals Grid */}
      {vitals.length > 0 ? (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: 'uppercase',
                letterSpacing: 1
              }}
            >
              Latest Vitals
            </span>
            <Btn small outline color={member.color} onClick={() => onOpenVitalModal(member.id)}>
              + Record
            </Btn>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {vitals.slice(0, 3).map((v) => (
              <div
                key={v.id}
                style={{
                  background: `${member.color}10`,
                  borderRadius: 8,
                  padding: '7px 8px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>
                  {v.type.split(' ')[0]}
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: member.color }}>
                  {v.value}
                </div>
                <div style={{ fontSize: 9, color: C.muted }}>{v.unit}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Btn
          full
          outline
          color={member.color}
          style={{ marginBottom: 10 }}
          onClick={() => onOpenVitalModal(member.id)}
        >
          ➕ Record Vitals
        </Btn>
      )}

      {/* Medications */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: C.muted,
              textTransform: 'uppercase',
              letterSpacing: 1
            }}
          >
            Medications ({medications.length})
          </span>
          <Btn small outline color={member.color} onClick={() => onOpenMedModal(member.id)}>
            + Add
          </Btn>
        </div>

        {medications.length === 0 ? (
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>No active medications listed.</p>
        ) : (
          medications.map((med) => (
            <div
              key={med.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px 0',
                borderBottom: `1px solid ${C.border}`
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  textDecoration: med.taken === true ? 'line-through' : 'none',
                  opacity: med.taken === true ? 0.4 : 1
                }}
              >
                💊 {med.name} <span style={{ color: C.muted, fontSize: 11 }}>{med.dose}</span>
              </span>

              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                {med.time && (
                  <span style={{ fontSize: 11, color: C.muted }}>{fmtTime(med.time)}</span>
                )}
                {med.taken === true ? (
                  <Chip label="✓ Taken" color={C.green} />
                ) : med.taken === 'skipped' ? (
                  <Chip label="Skipped" color={C.orange} />
                ) : med.freq !== 'As Needed' ? (
                  <>
                    <Btn small bg={C.green} onClick={() => onMarkMedTaken(med)}>
                      Take
                    </Btn>
                    <Btn small outline color={C.orange} onClick={() => onSkipMed(med)}>
                      Skip
                    </Btn>
                  </>
                ) : null}
                <Btn small outline color={C.red} onClick={() => onDeleteMed(med.id)}>
                  ×
                </Btn>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Appointments */}
      {appointments.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: C.muted,
              textTransform: 'uppercase',
              letterSpacing: 1,
              display: 'block',
              marginBottom: 6
            }}
          >
            Appointments
          </span>
          {appointments.slice(0, 2).map((appt) => {
            const prep = apptPrep[appt.id];
            return (
              <div
                key={appt.id}
                style={{
                  background: C.lBlue,
                  borderRadius: 9,
                  padding: '10px 12px',
                  marginBottom: 8
                }}
              >
                <div style={{ fontWeight: 700, color: C.blue, fontSize: 13 }}>
                  📅 {appt.doctor}
                </div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>
                  {appt.specialty} · {fmtDate(appt.date)}{' '}
                  {appt.time && `at ${fmtTime(appt.time)}`}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <Btn small bg={C.purple} onClick={() => handleGenerateQuestions(appt)}>
                    {prepLoading[appt.id] ? <Spin size={5} color="#fff" /> : "✨ Prep Q's"}
                  </Btn>
                  <Btn small outline color={C.red} onClick={() => onCancelAppt(appt.id)}>
                    Cancel
                  </Btn>
                </div>

                {prep && (
                  <div
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      borderRadius: 8,
                      padding: 10,
                      marginTop: 8
                    }}
                  >
                    <div style={{ fontWeight: 700, color: C.purple, fontSize: 12, marginBottom: 5 }}>
                      Suggested Questions for Doctor:
                    </div>
                    {prep.questions?.map((q, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: C.text, marginBottom: 3 }}>
                        • {q}
                      </div>
                    ))}
                    {prep.bring && prep.bring.length > 0 && (
                      <div style={{ fontSize: 11, color: C.teal, marginTop: 5 }}>
                        📎 <b>Bring:</b> {prep.bring.join(', ')}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Diet Plan */}
      {diet && <DietPlanCard diet={diet} />}

      {/* Action Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <Btn full bg={C.teal} onClick={handleGenerateDiet}>
          {dietLoading ? <Spin size={5} color="#fff" /> : '🥗 Diet Plan'}
        </Btn>
        <Btn full bg={member.color} onClick={() => onOpenApptModal(member.id)}>
          📅 Book Appt
        </Btn>
      </div>

      {member.phone && (
        <Btn
          full
          bg="#25D366"
          style={{ marginTop: 6 }}
          onClick={() => window.open(`tel:${member.phone}`)}
        >
          📞 Call {member.name.split(' ')[0]}
        </Btn>
      )}
    </Card>
  );
};
