import React, { useState, useEffect } from 'react';
import { Member, Appointment, Hospital, MLPrediction, AITriageResult } from '../types';
import { C } from '../data/seedData';
import { HOSPITALS } from '../data/hospitals';
import { idb } from '../lib/idb';
import { ML } from '../lib/naiveBayes';
import { triageSymptomsAI } from '../lib/aiService';
import { uid, fmtDate, fmtTime } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Inp } from '../components/common/Input';
import { Btn } from '../components/common/Button';
import { Chip } from '../components/common/Chip';
import { Spin } from '../components/common/Spinner';
import { HospitalCard } from '../components/scheduler/HospitalCard';

export const SchedulerPage: React.FC = () => {
  const { toast, sosMode, setSosMode } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [symptoms, setSymptoms] = useState('');
  const [mlResult, setMlResult] = useState<MLPrediction | null>(null);
  const [aiResult, setAiResult] = useState<AITriageResult | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<Record<string, string>>({});
  const [bookedSlots, setBookedSlots] = useState<Record<string, string>>({});
  const [upcomingAppts, setUpcomingAppts] = useState<Appointment[]>([]);

  const loadData = async () => {
    const [m, ap] = await Promise.all([
      idb.all<Member>('members'),
      idb.all<Appointment>('appointments')
    ]);
    setMembers(m);
    setUpcomingAppts(ap.filter((a) => a.status === 'upcoming').sort((a, b) => (a.date > b.date ? 1 : -1)));
    if (m.length > 0 && !selectedMemberId) {
      setSelectedMemberId(m[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRunML = () => {
    if (!symptoms.trim()) {
      toast('Please enter your symptoms first', 'warn');
      return;
    }
    const result = ML.predict(symptoms);
    setMlResult(result);
    if (result.urgency === 'emergency') {
      setSosMode(true);
      toast('🚨 Emergency detected! Urgent hospital care recommended', 'err');
    } else {
      toast(`Predicted: ${result.label} (${result.confidence}%)`);
    }
  };

  const handleRunAI = async () => {
    if (!symptoms.trim()) {
      toast('Please enter your symptoms first', 'warn');
      return;
    }
    handleRunML();
    setIsAiLoading(true);
    try {
      const triage = await triageSymptomsAI(symptoms);
      setAiResult(triage);
      if (triage.urgency === 'emergency') {
        setSosMode(true);
      }
    } catch (err: any) {
      toast(err.message || 'Triage error', 'err');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleBookHospital = async (hospital: Hospital) => {
    const slot = selectedSlots[hospital.id];
    if (!slot) {
      toast('Please pick an appointment time slot first', 'warn');
      return;
    }

    const appt: Appointment = {
      id: uid(),
      memberId: selectedMemberId,
      doctor: hospital.name,
      specialty: mlResult?.label || 'General / Emergency',
      date: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
      time: slot,
      notes: symptoms ? `Symptoms: ${symptoms}` : 'Routine booking',
      status: 'upcoming'
    };

    await idb.put('appointments', appt);
    setBookedSlots((prev) => ({ ...prev, [hospital.id]: slot }));
    await loadData();
    toast(`✅ Confirmed booking at ${hospital.name}!`);
  };

  const handleCancelAppt = async (id: string) => {
    const a = await idb.get<Appointment>('appointments', id);
    if (a) {
      await idb.put('appointments', { ...a, status: 'cancelled' });
      await loadData();
      toast('Appointment cancelled', 'warn');
    }
  };

  const urgencyColors = {
    emergency: C.red,
    urgent: C.orange,
    routine: C.green
  };

  const filteredHospitals = HOSPITALS.filter((h) => !sosMode || h.erBeds > 0);

  return (
    <div>
      <Header title="Smart Scheduler" subtitle="Clinical Triage & Real-time Hospital Booking" />

      {/* Member Selector */}
      {members.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: C.muted,
              letterSpacing: 1,
              textTransform: 'uppercase',
              marginBottom: 6
            }}
          >
            Booking Consultation For
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {members.map((m) => {
              const isSelected = selectedMemberId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMemberId(m.id)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 20,
                    border: `2px solid ${isSelected ? m.color : C.border}`,
                    background: isSelected ? `${m.color}18` : '#ffffff',
                    color: isSelected ? m.color : C.text,
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: 'pointer'
                  }}
                >
                  {m.avatar} {m.name.split(' ')[0]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Symptom Analyzer Card */}
      <Card style={{ marginBottom: 12 }}>
        <div style={{ fontWeight: 800, color: C.navy, marginBottom: 8, fontSize: 14 }}>
          🩺 AI & ML Symptom Triage
        </div>
        <Inp
          rows={3}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Describe your current symptoms... e.g. 'sharp left chest pain and shortness of breath radiating to arm for 2 hours'"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <Btn full bg={C.purple} onClick={handleRunML}>
            🧠 ML Instant
          </Btn>
          <Btn full bg={C.navy} onClick={handleRunAI} disabled={isAiLoading}>
            {isAiLoading ? <Spin size={5} color="#fff" /> : '✨ AI Deep Triage'}
          </Btn>
        </div>

        {/* Local ML Prediction Output */}
        {mlResult && (
          <div style={{ marginTop: 10, background: C.lPurple, borderRadius: 9, padding: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontWeight: 700, color: C.purple }}>
                🧠 Recommended Specialty: {mlResult.label}
              </span>
              <div style={{ display: 'flex', gap: 5 }}>
                <Chip label={`${mlResult.confidence}% match`} color={C.purple} />
                <Chip label={mlResult.urgency.toUpperCase()} color={urgencyColors[mlResult.urgency]} />
              </div>
            </div>

            {mlResult.urgency === 'emergency' && (
              <div style={{ color: C.red, fontWeight: 700, fontSize: 12, marginTop: 4 }}>
                🚨 Immediate emergency hospital admission required!
              </div>
            )}
          </div>
        )}

        {/* AI Deep Triage Output */}
        {aiResult && (
          <div
            style={{
              marginTop: 8,
              background: aiResult.urgency === 'emergency' ? C.lRed : C.lBlue,
              borderRadius: 9,
              padding: 10,
              borderLeft: `4px solid ${urgencyColors[aiResult.urgency]}`
            }}
          >
            <div style={{ fontWeight: 700, color: urgencyColors[aiResult.urgency], marginBottom: 5 }}>
              🤖 Specialty Focus: {aiResult.specialty} ·{' '}
              <Chip label={aiResult.urgency.toUpperCase()} color={urgencyColors[aiResult.urgency]} />
            </div>

            <div style={{ fontSize: 13, color: C.text, marginBottom: 6 }}>
              {aiResult.recommendation}
            </div>

            {aiResult.redFlags && aiResult.redFlags.length > 0 && (
              <div style={{ fontSize: 11, color: C.red, marginBottom: 4 }}>
                <b>🚩 Red Flags:</b> {aiResult.redFlags.join(', ')}
              </div>
            )}

            {aiResult.immediateActions && aiResult.immediateActions.map((act, i) => (
              <div key={i} style={{ fontSize: 11, color: C.text, marginTop: 2 }}>
                ⚡ {act}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* SOS Mode Switch */}
      <div
        style={{
          background: C.lRed,
          borderRadius: 10,
          padding: '10px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12
        }}
      >
        <div>
          <div style={{ fontWeight: 700, color: C.red, fontSize: 13 }}>
            🚨 Emergency SOS Mode {sosMode ? 'ACTIVE' : 'OFF'}
          </div>
          <div style={{ fontSize: 11, color: C.muted }}>
            {sosMode ? 'Filtering only hospitals with open ER beds' : 'Toggle for emergency hospital intake'}
          </div>
        </div>

        <div
          onClick={() => setSosMode((prev) => !prev)}
          style={{
            width: 44,
            height: 24,
            borderRadius: 12,
            cursor: 'pointer',
            background: sosMode ? C.red : C.border,
            position: 'relative',
            transition: 'background 0.3s ease'
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 2,
              width: 20,
              height: 20,
              borderRadius: '50%',
              background: '#ffffff',
              left: sosMode ? 22 : 2,
              transition: 'left 0.3s ease',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }}
          />
        </div>
      </div>

      {/* Hospitals List */}
      {filteredHospitals.map((h) => (
        <HospitalCard
          key={h.id}
          hospital={h}
          sosMode={sosMode}
          selectedSlot={selectedSlots[h.id]}
          bookedSlot={bookedSlots[h.id]}
          onSelectSlot={(hId, slot) => setSelectedSlots((s) => ({ ...s, [hId]: slot }))}
          onBook={handleBookHospital}
        />
      ))}

      {/* Upcoming Appts */}
      {upcomingAppts.length > 0 && (
        <div style={{ marginTop: 14 }}>
          <h2 style={{ fontWeight: 800, color: C.navy, fontSize: 15, marginBottom: 8 }}>
            📅 Upcoming Bookings ({upcomingAppts.length})
          </h2>

          {upcomingAppts.map((a) => {
            const mem = members.find((m) => m.id === a.memberId);
            return (
              <Card key={a.id} style={{ borderLeft: `3px solid ${C.blue}`, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{a.doctor}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>
                      {a.specialty} · {fmtDate(a.date)} {a.time && `at ${fmtTime(a.time)}`}
                    </div>
                    {mem && <Chip label={mem.name.split(' ')[0]} color={mem.color} sm />}
                  </div>
                  <Btn small outline color={C.red} onClick={() => handleCancelAppt(a.id)}>
                    Cancel
                  </Btn>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
