import React, { useState, useEffect } from 'react';
import { Member, Medication, LabReport, Appointment, Vital, HealthAnalyticsAI } from '../types';
import { C } from '../data/seedData';
import { idb } from '../lib/idb';
import { generateHealthAnalyticsAI } from '../lib/aiService';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Btn } from '../components/common/Button';
import { Chip } from '../components/common/Chip';
import { Bar } from '../components/common/ProgressBar';
import { Spin } from '../components/common/Spinner';

export const AnalyticsPage: React.FC = () => {
  const { toast } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [meds, setMeds] = useState<Medication[]>([]);
  const [labs, setLabs] = useState<LabReport[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [aiInsights, setAiInsights] = useState<HealthAnalyticsAI | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const loadData = async () => {
    const [m, md, lb, ap, vt] = await Promise.all([
      idb.all<Member>('members'),
      idb.all<Medication>('medications'),
      idb.all<LabReport>('lab_reports'),
      idb.all<Appointment>('appointments'),
      idb.all<Vital>('vitals')
    ]);
    setMembers(m);
    setMeds(md);
    setLabs(lb);
    setAppts(ap);
    setVitals(vt);
    if (m.length > 0 && !selectedMemberId) {
      setSelectedMemberId(m[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentMember = members.find((m) => m.id === selectedMemberId);
  const memberMeds = meds.filter((m) => m.memberId === selectedMemberId && m.freq !== 'As Needed');
  const takenCount = memberMeds.filter((m) => m.taken === true).length;
  const adherence = memberMeds.length ? Math.round((takenCount / memberMeds.length) * 100) : 100;

  const memberLabs = labs.filter((l) => l.memberId === selectedMemberId);
  const abnormalParameters = memberLabs.flatMap(
    (l) => l.parameters?.filter((p) => p.status !== 'Normal') || []
  );

  const memberAppts = appts.filter((a) => a.memberId === selectedMemberId);
  const memberVitals = vitals.filter((v) => v.memberId === selectedMemberId);
  const upcomingCount = memberAppts.filter((a) => a.status === 'upcoming').length;

  const handleGenerateInsights = async () => {
    if (!currentMember) return;
    setIsAiLoading(true);
    try {
      const insights = await generateHealthAnalyticsAI(
        currentMember,
        adherence,
        abnormalParameters.length
      );
      setAiInsights(insights);
      toast('Health intelligence insights ready!');
    } catch (err: any) {
      toast(err.message || 'Failed to generate insights', 'err');
    } finally {
      setIsAiLoading(false);
    }
  };

  const priorityColors = {
    high: C.red,
    medium: C.orange,
    low: C.green
  };

  const trendColors = {
    improving: C.green,
    stable: C.blue,
    declining: C.red
  };

  return (
    <div>
      <Header title="Analytics" subtitle="Health Insights & Longitudinal Trends" />

      {/* Member Selector */}
      {members.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }}>
          {members.map((m) => {
            const isSelected = selectedMemberId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedMemberId(m.id);
                  setAiInsights(null);
                }}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: `2px solid ${isSelected ? m.color : C.border}`,
                  background: isSelected ? `${m.color}18` : '#ffffff',
                  color: isSelected ? m.color : C.text,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {m.avatar} {m.name.split(' ')[0]}
              </button>
            );
          })}
        </div>
      )}

      {/* 4 Primary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        {[
          {
            label: 'Adherence',
            val: `${adherence}%`,
            col: adherence >= 80 ? C.green : adherence >= 50 ? C.orange : C.red,
            sub: `${takenCount} of ${memberMeds.length} meds taken`
          },
          {
            label: 'Abnormal Labs',
            val: abnormalParameters.length,
            col: abnormalParameters.length > 0 ? C.red : C.green,
            sub: 'flagged biomarkers'
          },
          {
            label: 'Upcoming Appts',
            val: upcomingCount,
            col: C.blue,
            sub: 'scheduled consultations'
          },
          {
            label: 'Vitals Logged',
            val: memberVitals.length,
            col: C.purple,
            sub: 'historical readings'
          }
        ].map((s) => (
          <Card key={s.label} style={{ textAlign: 'center', marginBottom: 0 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.muted,
                textTransform: 'uppercase',
                letterSpacing: 0.8,
                marginBottom: 4
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.col }}>{s.val}</div>
            <div style={{ fontSize: 10, color: C.muted }}>{s.sub}</div>
          </Card>
        ))}
      </div>

      {/* Adherence Details */}
      {memberMeds.length > 0 && (
        <Card style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 700, color: C.navy, marginBottom: 6 }}>
            💊 Today's Medication Compliance
          </div>
          <Bar
            v={adherence}
            color={adherence >= 80 ? C.green : adherence >= 50 ? C.orange : C.red}
            h={10}
          />
          <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
            {takenCount} completed out of {memberMeds.length} required doses
          </div>
        </Card>
      )}

      {/* Abnormal Values */}
      {abnormalParameters.length > 0 && (
        <Card style={{ borderLeft: `3px solid ${C.red}`, marginBottom: 10 }}>
          <div style={{ fontWeight: 700, color: C.navy, marginBottom: 8 }}>
            ⚠️ Out of Range Biomarkers ({abnormalParameters.length})
          </div>
          {abnormalParameters.slice(0, 8).map((p, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '6px 0',
                borderBottom: `1px solid ${C.border}`
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>
                  {p.name}: <span style={{ color: C.red }}>{p.result}</span> {p.unit}
                </div>
                <div style={{ fontSize: 10, color: C.muted }}>
                  Target: {p.normalRange} {p.unit}
                </div>
              </div>
              <Chip label={p.status} color={p.status === 'High' ? C.red : C.orange} sm />
            </div>
          ))}
        </Card>
      )}

      {/* Recent Vitals */}
      {memberVitals.length > 0 && (
        <Card style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: 700, color: C.navy, marginBottom: 8 }}>
            📊 Recent Vitals History
          </div>
          {memberVitals
            .slice(-5)
            .reverse()
            .map((v, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '5px 0',
                  borderBottom: `1px solid ${C.border}`
                }}
              >
                <span style={{ fontSize: 12 }}>{v.type}</span>
                <span style={{ fontWeight: 700, color: C.blue }}>
                  {v.value} {v.unit}
                </span>
              </div>
            ))}
        </Card>
      )}

      {/* AI Health Insights Trigger */}
      <Btn
        full
        bg={C.blue}
        onClick={handleGenerateInsights}
        style={{ marginBottom: 14 }}
        disabled={isAiLoading}
      >
        {isAiLoading ? <Spin size={5} color="#fff" /> : '✨ Generate AI Health Insights'}
      </Btn>

      {/* AI Health Insights Display */}
      {aiInsights && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ fontWeight: 800, fontSize: 15, color: C.navy, margin: 0 }}>
              AI Clinical Synthesis
            </h2>
            <Chip
              label={`Trend: ${aiInsights.overallTrend.toUpperCase()}`}
              color={trendColors[aiInsights.overallTrend]}
            />
          </div>

          {aiInsights.message && (
            <Card
              style={{
                background: `linear-gradient(135deg, ${C.blue}10, ${C.purple}10)`,
                borderLeft: `3px solid ${C.blue}`,
                marginBottom: 10
              }}
            >
              <p style={{ margin: 0, fontSize: 13, color: C.navy, fontStyle: 'italic' }}>
                "{aiInsights.message}"
              </p>
            </Card>
          )}

          {aiInsights.insights?.map((ins, i) => (
            <Card key={i} style={{ borderLeft: `3px solid ${priorityColors[ins.priority]}`, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>{ins.title}</span>
                <Chip label={ins.priority.toUpperCase()} color={priorityColors[ins.priority]} sm />
              </div>
              <div style={{ fontSize: 12, color: C.text, marginBottom: 4 }}>
                {ins.description}
              </div>
              <div style={{ fontSize: 11, color: priorityColors[ins.priority], fontWeight: 700 }}>
                → {ins.action}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Database Entity Stats */}
      <Card style={{ marginTop: 8 }}>
        <div style={{ fontWeight: 700, color: C.navy, marginBottom: 8 }}>
          🗄️ Local Encrypted Health Store
        </div>
        {[
          { l: 'Registered Members', v: members.length, c: C.blue },
          { l: 'Prescribed Medications', v: meds.length, c: C.purple },
          { l: 'Diagnostic Lab Reports', v: labs.length, c: C.orange },
          { l: 'Recorded Appointments', v: appts.length, c: C.teal },
          { l: 'Tracked Vital Logs', v: vitals.length, c: C.green }
        ].map((s) => (
          <div
            key={s.l}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '6px 0',
              borderBottom: `1px solid ${C.border}`
            }}
          >
            <span style={{ fontSize: 12 }}>{s.l}</span>
            <span style={{ fontWeight: 700, color: s.c }}>{s.v}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
