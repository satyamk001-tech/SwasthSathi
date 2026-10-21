import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Member, Medication, Appointment, Vital } from '../types';
import { C } from '../data/seedData';
import { idb } from '../lib/idb';
import { uid, today } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Btn } from '../components/common/Button';
import { MissedMedAlert } from '../components/dashboard/MissedMedAlert';
import { MemberCard } from '../components/dashboard/MemberCard';
import { MemberModal } from '../components/dashboard/MemberModal';
import { MedicationModal } from '../components/dashboard/MedicationModal';
import { AppointmentModal } from '../components/dashboard/AppointmentModal';
import { VitalModal } from '../components/dashboard/VitalModal';

export const DashboardPage: React.FC = () => {
  const { toast, refreshKey, triggerRefresh } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);

  // Modals state
  const [activeModal, setActiveModal] = useState<'mem' | 'med' | 'appt' | 'vital' | null>(null);
  const [modalMemberId, setModalMemberId] = useState<string>('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [m, md, ap, vt] = await Promise.all([
        idb.all<Member>('members'),
        idb.all<Medication>('medications'),
        idb.all<Appointment>('appointments'),
        idb.all<Vital>('vitals')
      ]);
      setMembers(m.sort((a, b) => (a._ts || 0) - (b._ts || 0)));
      setMeds(md);
      setAppts(ap.filter((a) => a.status === 'upcoming').sort((a, b) => (a.date > b.date ? 1 : -1)));
      setVitals(vt);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  // Missed medications
  const missedMeds = useMemo(() => {
    const currentHour = new Date().getHours();
    return meds.filter(
      (m) =>
        !m.taken &&
        m.freq !== 'As Needed' &&
        m.time &&
        parseInt(m.time.split(':')[0], 10) <= currentHour
    );
  }, [meds]);

  // Actions
  const handleMarkTaken = async (med: Medication) => {
    await idb.put('medications', { ...med, taken: true });
    await idb.put('med_logs', {
      id: uid(),
      medId: med.id,
      memberId: med.memberId,
      status: 'taken',
      at: new Date().toLocaleTimeString()
    });
    await loadData();
    toast(`✅ ${med.name} marked as taken!`);
  };

  const handleSkipMed = async (med: Medication) => {
    await idb.put('medications', { ...med, taken: 'skipped' });
    await loadData();
    toast(`${med.name} skipped for today`, 'warn');
  };

  const handleDeleteMed = async (id: string) => {
    await idb.del('medications', id);
    await loadData();
    toast('Medication removed', 'warn');
  };

  const handleCancelAppt = async (id: string) => {
    const a = await idb.get<Appointment>('appointments', id);
    if (a) {
      await idb.put('appointments', { ...a, status: 'cancelled' });
      await loadData();
      toast('Appointment cancelled', 'warn');
    }
  };

  const handleWhatsAppAlert = (mem: Member, med: Medication) => {
    const msg = `🏥 SwasthSathi Medication Reminder\n\nNamaste ${mem.name.split(' ')[0]},\nIt is time to take your scheduled dose:\n💊 ${med.name} (${med.dose || ''})\n${med.notes ? `Note: ${med.notes}` : ''}\n\nStay healthy! 🌸`;
    const cleanPhone = (mem.phone || '').replace(/\D/g, '');
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Member CRUD
  const handleSaveMember = async (data: {
    id?: string;
    name: string;
    age: number;
    role: string;
    blood: string;
    phone: string;
    conditions: string[];
    color?: string;
  }) => {
    const colors = [C.blue, C.purple, C.teal, C.pink];
    const memberId = data.id || uid();
    const newMember: Member = {
      id: memberId,
      name: data.name,
      age: data.age,
      role: data.role,
      avatar: data.name[0].toUpperCase(),
      color: data.color || colors[Math.floor(Math.random() * colors.length)],
      blood: data.blood,
      phone: data.phone,
      conditions: data.conditions
    };
    await idb.put('members', newMember);
    await loadData();
    setActiveModal(null);
    setEditingMember(null);
    toast(data.id ? 'Member updated!' : 'New family member added!');
  };

  const handleDeleteMember = async (id: string) => {
    if (!window.confirm('Delete this family member and their associated records?')) return;
    await idb.del('members', id);
    const allMeds = await idb.all<Medication>('medications');
    for (const m of allMeds.filter((x) => x.memberId === id)) {
      await idb.del('medications', m.id);
    }
    await loadData();
    toast('Member removed', 'warn');
  };

  // Sub-items Save
  const handleSaveMed = async (data: any) => {
    await idb.put('medications', {
      id: uid(),
      memberId: modalMemberId,
      ...data,
      taken: false
    });
    await loadData();
    setActiveModal(null);
    toast('Medication added to schedule!');
  };

  const handleSaveAppt = async (data: any) => {
    await idb.put('appointments', {
      id: uid(),
      memberId: modalMemberId,
      ...data,
      status: 'upcoming'
    });
    await loadData();
    setActiveModal(null);
    toast('Doctor appointment booked!');
  };

  const handleSaveVital = async (data: any) => {
    await idb.put('vitals', {
      id: uid(),
      memberId: modalMemberId,
      ...data,
      date: today()
    });
    await loadData();
    setActiveModal(null);
    toast('Health vital recorded!');
  };

  return (
    <div>
      <Header
        title="Family Dashboard"
        subtitle={`${new Date().toDateString()} · ${members.length} Active Members`}
        showExport
      />

      {/* Missed Medication Alert */}
      <MissedMedAlert
        missed={missedMeds}
        members={members}
        onTake={handleMarkTaken}
        onSkip={handleSkipMed}
        onWhatsApp={handleWhatsAppAlert}
      />

      {/* Quick Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { l: 'Members', v: members.length, i: '👨👩👦', c: C.blue },
          { l: 'Meds Today', v: meds.filter((m) => m.freq !== 'As Needed').length, i: '💊', c: C.purple },
          { l: 'Upcoming', v: appts.length, i: '📅', c: C.teal }
        ].map((s) => (
          <Card key={s.l} style={{ textAlign: 'center', padding: '12px 8px', marginBottom: 0 }}>
            <div style={{ fontSize: 22 }}>{s.i}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 10, color: C.muted, fontWeight: 600 }}>{s.l}</div>
          </Card>
        ))}
      </div>

      {/* Family Members Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10
        }}
      >
        <h2 style={{ fontSize: 17, fontWeight: 900, color: C.navy, margin: 0 }}>
          Family Members
        </h2>
        <Btn
          small
          bg={C.blue}
          onClick={() => {
            setEditingMember(null);
            setActiveModal('mem');
          }}
        >
          + Add Member
        </Btn>
      </div>

      {/* Family Members List */}
      {members.map((mem) => {
        const memMeds = meds.filter((m) => m.memberId === mem.id);
        const memVits = vitals.filter((v) => v.memberId === mem.id);
        const memAppts = appts.filter((a) => a.memberId === mem.id);

        return (
          <MemberCard
            key={mem.id}
            member={mem}
            medications={memMeds}
            vitals={memVits}
            appointments={memAppts}
            onEditMember={(m) => {
              setEditingMember(m);
              setActiveModal('mem');
            }}
            onDeleteMember={handleDeleteMember}
            onOpenVitalModal={(id) => {
              setModalMemberId(id);
              setActiveModal('vital');
            }}
            onOpenMedModal={(id) => {
              setModalMemberId(id);
              setActiveModal('med');
            }}
            onOpenApptModal={(id) => {
              setModalMemberId(id);
              setActiveModal('appt');
            }}
            onMarkMedTaken={handleMarkTaken}
            onSkipMed={handleSkipMed}
            onDeleteMed={handleDeleteMed}
            onCancelAppt={handleCancelAppt}
          />
        );
      })}

      {/* Modals */}
      {activeModal === 'mem' && (
        <MemberModal
          initial={editingMember}
          onClose={() => {
            setActiveModal(null);
            setEditingMember(null);
          }}
          onSave={handleSaveMember}
        />
      )}

      {activeModal === 'med' && (
        <MedicationModal
          onClose={() => setActiveModal(null)}
          onSave={handleSaveMed}
        />
      )}

      {activeModal === 'appt' && (
        <AppointmentModal
          onClose={() => setActiveModal(null)}
          onSave={handleSaveAppt}
        />
      )}

      {activeModal === 'vital' && (
        <VitalModal
          onClose={() => setActiveModal(null)}
          onSave={handleSaveVital}
        />
      )}
    </div>
  );
};
