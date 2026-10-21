import React, { useState, useEffect } from 'react';
import { Member, Vital, Medication, Appointment } from '../types';
import { idb } from '../lib/idb';
import { uid, today } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { MemberModal } from '../components/dashboard/MemberModal';
import { VitalModal } from '../components/dashboard/VitalModal';

export const FamilyPage: React.FC = () => {
  const { toast, selectedMemberId, setSelectedMemberId, refreshKey, triggerRefresh } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);

  const [activeModal, setActiveModal] = useState<'mem' | 'vital' | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [modalMemberId, setModalMemberId] = useState<string>('');

  const loadData = async () => {
    try {
      const [m, v, md, ap] = await Promise.all([
        idb.all<Member>('members'),
        idb.all<Vital>('vitals'),
        idb.all<Medication>('medications'),
        idb.all<Appointment>('appointments')
      ]);
      setMembers(m);
      setVitals(v);
      setMeds(md);
      setAppts(ap);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const handleSaveMember = async (data: any) => {
    const memberId = data.id || uid();
    const newMember: Member = {
      id: memberId,
      name: data.name,
      age: data.age,
      role: data.role,
      avatar: data.name[0].toUpperCase(),
      color: data.color || '#006194',
      blood: data.blood,
      phone: data.phone,
      conditions: data.conditions
    };
    await idb.put('members', newMember);
    await loadData();
    setActiveModal(null);
    setEditingMember(null);
    toast(data.id ? 'Profile updated!' : 'New family member enrolled!', 'ok');
    triggerRefresh();
  };

  const handleSaveVital = async (data: any) => {
    await idb.put('vitals', {
      id: uid(),
      memberId: modalMemberId || members[0]?.id || 'm1',
      ...data,
      date: today()
    });
    await loadData();
    setActiveModal(null);
    toast('Vital telemetry recorded!', 'ok');
    triggerRefresh();
  };

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="font-headline-sm text-lg font-bold text-on-surface">Family Directory</h2>
          <p className="font-body-sm text-xs text-on-surface-variant">
            {members.length} registered profiles • Managed under Sarah Jenkins
          </p>
        </div>
        <button
          onClick={() => {
            setEditingMember(null);
            setActiveModal('mem');
          }}
          className="min-h-[38px] px-3.5 bg-primary text-on-primary rounded-xl font-label-md text-xs font-bold flex items-center gap-1 active:scale-95 shadow-xs"
        >
          <span className="material-symbols-outlined text-[17px]">person_add</span>
          <span>Add</span>
        </button>
      </div>

      <div className="flex flex-col space-y-3">
        {members.map((mem) => {
          const memMeds = meds.filter((m) => m.memberId === mem.id);
          const memVits = vitals.filter((v) => v.memberId === mem.id);

          return (
            <div
              key={mem.id}
              className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container flex flex-col gap-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shrink-0 shadow-xs ring-1 ring-surface-container-high">
                    {mem.photoUrl ? (
                      <img src={mem.photoUrl} alt={mem.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sm bg-primary-fixed text-on-primary-fixed">
                        {mem.avatar}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="font-label-lg text-sm font-bold text-on-surface">{mem.name}</h3>
                      <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px]">
                        {mem.age}y • {mem.role}
                      </span>
                    </div>
                    <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                      Blood: <span className="font-semibold text-on-surface">{mem.blood || 'Unknown'}</span> • {mem.phone || 'No phone listed'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setEditingMember(mem);
                    setActiveModal('mem');
                  }}
                  className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant text-sm"
                >
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>

              {/* Conditions & Allergies badges */}
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {mem.conditions?.map((c, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface font-label-sm text-[10.5px] font-medium"
                  >
                    • {c}
                  </span>
                ))}
                {mem.allergies?.map((a, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[10.5px] font-bold flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[12px]">warning</span>
                    {a}
                  </span>
                ))}
              </div>

              {/* Quick vitals row */}
              <div className="bg-surface-container-low p-2.5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase font-bold block">
                    Active Regimen
                  </span>
                  <span className="font-body-sm text-xs font-bold text-on-surface">
                    {memMeds.length} Prescribed Medications
                  </span>
                </div>
                <button
                  onClick={() => {
                    setModalMemberId(mem.id);
                    setActiveModal('vital');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-surface-container text-primary font-label-sm text-xs font-bold hover:bg-surface-container-high transition-colors"
                >
                  + Log Vital
                </button>
              </div>
            </div>
          );
        })}
      </div>

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

      {activeModal === 'vital' && (
        <VitalModal
          onClose={() => setActiveModal(null)}
          onSave={handleSaveVital}
        />
      )}
    </div>
  );
};
