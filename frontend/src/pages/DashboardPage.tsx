import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Member, Medication, Appointment, Vital, LabReport } from '../types';
import { idb } from '../lib/idb';
import { uid, today } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { MemberModal } from '../components/dashboard/MemberModal';
import { MedicationModal } from '../components/dashboard/MedicationModal';
import { AppointmentModal } from '../components/dashboard/AppointmentModal';
import { VitalModal } from '../components/dashboard/VitalModal';

export const DashboardPage: React.FC = () => {
  const { setTab, setSosMode, selectedMemberId, setSelectedMemberId, toast, refreshKey, triggerRefresh } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [meds, setMeds] = useState<Medication[]>([]);
  const [appts, setAppts] = useState<Appointment[]>([]);
  const [vitals, setVitals] = useState<Vital[]>([]);
  const [labs, setLabs] = useState<LabReport[]>([]);

  // Interactive UI states
  const [isArthurMedTaken, setIsArthurMedTaken] = useState(false);
  const [isArthurMedSnoozed, setIsArthurMedSnoozed] = useState(false);
  const [isTakingMed, setIsTakingMed] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState<'mem' | 'med' | 'appt' | 'vital' | null>(null);
  const [modalMemberId, setModalMemberId] = useState<string>('');
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [m, md, ap, vt, lb] = await Promise.all([
        idb.all<Member>('members'),
        idb.all<Medication>('medications'),
        idb.all<Appointment>('appointments'),
        idb.all<Vital>('vitals'),
        idb.all<LabReport>('lab_reports')
      ]);
      setMembers(m);
      setMeds(md);
      setAppts(ap.filter((a) => a.status === 'upcoming').sort((a, b) => (a.date > b.date ? 1 : -1)));
      setVitals(vt);
      setLabs(lb);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, refreshKey]);

  // Greeting by time of day
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, []);

  // Filtered members
  const filteredMembers = useMemo(() => {
    if (selectedMemberId === 'all') return members;
    return members.filter((m) => m.id === selectedMemberId);
  }, [members, selectedMemberId]);

  // Arthur's overdue medication interaction
  const handleArthurLogTaken = () => {
    setIsTakingMed(true);
    setTimeout(async () => {
      setIsTakingMed(false);
      setIsArthurMedTaken(true);
      const artMed = meds.find((m) => m.name.toLowerCase().includes('metformin'));
      if (artMed) {
        await idb.put('medications', { ...artMed, taken: true });
        await idb.put('med_logs', {
          id: uid(),
          medId: artMed.id,
          memberId: artMed.memberId,
          status: 'taken',
          at: new Date().toLocaleTimeString()
        });
      }
      toast("Arthur's Metformin confirmed and recorded in clinical chart!", 'ok');
      triggerRefresh();
    }, 700);
  };

  const handleArthurSnooze = () => {
    setIsArthurMedSnoozed(true);
    toast("Reminder snoozed for 15 minutes", 'info');
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

  // Save sub-items
  const handleSaveVital = async (data: any) => {
    await idb.put('vitals', {
      id: uid(),
      memberId: modalMemberId || members[0]?.id || 'm1',
      ...data,
      date: today()
    });
    await loadData();
    setActiveModal(null);
    toast('Health vital recorded successfully!', 'ok');
  };

  return (
    <div className="flex flex-col w-full gap-4 animate-fade-in">
      {/* 1. Header Greeting & Date */}
      <section className="flex flex-col gap-1 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-xs uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
            <h1 className="font-headline-lg-mobile text-2xl text-on-surface font-extrabold tracking-tight">
              {greeting}, Sarah
            </h1>
          </div>

          <div className="flex items-center -space-x-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden shadow-sm flex items-center justify-center ring-2 ring-surface">
              <img
                className="w-full h-full object-cover"
                alt="Sarah Jenkins"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIzTV1iUMFC455-WQ2wvKCae_g8EvTrh8M0TfVlDonTu8ufPMeX593v3X1nEmgXou1lf74diUQQebz3U9vU6jdtjrl1RFOudqPJh47D5YcX9N8FX8nUUiPuTrn9p0imdYmOUKez3B5w-xHXPgpKkcHdhpZZqMagmDwLqWYkA4cM-ZfsSIlg9VTwdgJhwDIO0lqFLCDj2Rhz18TnEIgDpo2XmRpMEGIA4QyuGFUQcyAl-aSnF1eHNtX"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-md text-xs shadow-sm font-extrabold ring-2 ring-surface">
              {members.length}+
            </div>
          </div>
        </div>

        <p className="font-body-sm text-xs text-on-surface-variant">
          3 priority family health tasks need your confirmation before noon.
        </p>

        {/* Context Switcher Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
          <button
            onClick={() => setSelectedMemberId('all')}
            className={`min-h-[38px] px-3.5 py-1.5 rounded-full font-label-md text-xs font-semibold shrink-0 shadow-xs transition-all ${
              selectedMemberId === 'all'
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            All Family ({members.length})
          </button>
          {members.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMemberId(m.id)}
              className={`min-h-[38px] px-3 py-1.5 rounded-full font-label-md text-xs font-semibold shrink-0 transition-all flex items-center gap-1.5 ${
                selectedMemberId === m.id
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: m.color || '#006a61' }}
              />
              <span>{m.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 2. Quick Action Grid (Clinical utility bar) */}
      <section className="grid grid-cols-4 gap-2">
        <button
          onClick={() => {
            setModalMemberId(members[0]?.id || 'm1');
            setActiveModal('vital');
          }}
          className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-container-lowest shadow-xs hover:shadow-sm transition-all active:scale-95 text-center min-h-[74px] border border-surface-container"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-1 group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">monitor_heart</span>
          </div>
          <span className="font-label-sm text-[11px] font-bold text-on-surface leading-tight">Log Vitals</span>
        </button>

        <button
          onClick={() => setTab('scanner')}
          className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-container-lowest shadow-xs hover:shadow-sm transition-all active:scale-95 text-center min-h-[74px] border border-surface-container"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-secondary flex items-center justify-center mb-1 group-hover:bg-secondary group-hover:text-on-secondary transition-colors">
            <span className="material-symbols-outlined text-[20px]">document_scanner</span>
          </div>
          <span className="font-label-sm text-[11px] font-bold text-on-surface leading-tight">Scan Lab</span>
        </button>

        <button
          onClick={() => setTab('medi')}
          className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-surface-container-lowest shadow-xs hover:shadow-sm transition-all active:scale-95 text-center min-h-[74px] border border-surface-container"
        >
          <div className="w-10 h-10 rounded-full bg-surface-container-high text-primary flex items-center justify-center mb-1 group-hover:bg-primary group-hover:text-on-primary transition-colors">
            <span className="material-symbols-outlined text-[20px]">medication</span>
          </div>
          <span className="font-label-sm text-[11px] font-bold text-on-surface leading-tight">Rx Check</span>
        </button>

        <button
          onClick={() => {
            setSosMode(true);
            setTab('sched');
          }}
          className="group flex flex-col items-center justify-center p-2.5 rounded-xl bg-error-container shadow-xs hover:shadow-sm transition-all active:scale-95 text-center min-h-[74px] border border-tertiary-fixed-dim"
        >
          <div className="w-10 h-10 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center mb-1 shadow-sm">
            <span className="material-symbols-outlined text-[20px] animate-pulse">emergency</span>
          </div>
          <span className="font-label-sm text-[11px] font-extrabold text-on-error-container leading-tight">Fast SOS</span>
        </button>
      </section>

      {/* 3. Attention Required (Clinical Priority Tasks) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-tertiary text-[20px]">notification_important</span>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">Attention Required</h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold">
            {isArthurMedTaken ? '2 Pending' : '3 Pending'}
          </span>
        </div>

        {/* Alert 1: Arthur Overdue Medication */}
        {!isArthurMedSnoozed && (
          <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col gap-2.5 relative overflow-hidden border border-surface-container">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary" />

            {isArthurMedTaken ? (
              <div className="p-3 flex items-center gap-2.5 bg-secondary-container text-on-secondary-container rounded-xl animate-fade-in pl-3 ml-1">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
                <div className="flex-1">
                  <p className="font-label-md text-xs font-bold">Arthur's Metformin Confirmed</p>
                  <p className="font-body-sm text-[11px] opacity-90">
                    Recorded at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Synced with Health Chart
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between pl-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-label-sm text-xs font-bold">
                      AJ
                    </div>
                    <div>
                      <span className="font-label-sm text-[10px] font-bold text-tertiary uppercase tracking-wider block leading-none">
                        Due Medication
                      </span>
                      <h3 className="font-body-md text-xs font-bold text-on-surface mt-0.5">
                        Arthur (Father)
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">alarm</span>
                    8:00 AM (Overdue)
                  </span>
                </div>

                <div className="bg-surface-container-low rounded-xl p-2.5 pl-3 ml-2 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-primary text-[22px]">pill</span>
                    <div>
                      <p className="font-label-lg text-xs font-bold text-on-surface">Metformin 500mg</p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">
                        Morning dose • Take with water after meal
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-2 pt-0.5">
                  <button
                    disabled={isTakingMed}
                    onClick={handleArthurLogTaken}
                    className="flex-1 min-h-[40px] rounded-xl bg-secondary text-on-secondary font-label-md text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-sm"
                  >
                    {isTakingMed ? (
                      <>
                        <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                        Recording...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        Log Taken
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleArthurSnooze}
                    className="min-h-[40px] px-3.5 rounded-xl bg-surface-container text-on-surface-variant font-label-md text-xs font-semibold flex items-center justify-center gap-1 hover:text-on-surface active:scale-98 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[17px]">snooze</span>
                    Snooze 15m
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Alert 2: Maya CBC Lab Result Flagged */}
        <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col gap-2.5 relative overflow-hidden border border-surface-container">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container" />
          <div className="flex items-start justify-between pl-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-sm text-xs font-bold">
                MJ
              </div>
              <div>
                <span className="font-label-sm text-[10px] font-bold text-primary uppercase tracking-wider block leading-none">
                  Clinical Lab Flag
                </span>
                <h3 className="font-body-md text-xs font-bold text-on-surface mt-0.5">Maya (Daughter)</h3>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-[11px] font-bold">
              CBC Panel
            </span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-2.5 pl-3 ml-2 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-xs font-bold text-on-surface">
                Hemoglobin Reading: 11.5 g/dL
              </span>
              <span className="font-label-sm text-xs text-tertiary font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[15px]">trending_down</span>
                Mild Low
              </span>
            </div>
            <p className="font-body-sm text-[11px] text-on-surface-variant leading-snug">
              Reference Range: 12.0 - 15.5 g/dL. Pediatrician suggested dietary iron adjustment.
            </p>
          </div>

          <div className="flex items-center justify-between pl-2 pt-0.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px] font-medium">
              <span className="material-symbols-outlined text-[14px] text-primary">chat_bubble</span>
              Review with Clinician
            </span>
            <button
              onClick={() => setTab('scanner')}
              className="min-h-[38px] px-2 text-primary font-label-md text-xs font-bold flex items-center gap-0.5 hover:underline"
            >
              View Full Lab
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Alert 3: David Cardiology Appointment */}
        <div
          onClick={() => setTab('sched')}
          className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm flex items-center justify-between relative overflow-hidden border border-surface-container cursor-pointer hover:bg-surface-container-lowest/80 transition-colors"
        >
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary" />
          <div className="flex items-start gap-2.5 pl-2">
            <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[20px]">calendar_clock</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-sm text-[10px] uppercase font-bold text-secondary tracking-wider">
                Tomorrow • 10:30 AM
              </span>
              <h4 className="font-label-lg text-xs font-bold text-on-surface">
                David • Cardiology Follow-up
              </h4>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Dr. Aris Thorne • Northwest Heart Pavilion
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[20px] text-on-surface-variant">chevron_right</span>
        </div>
      </section>

      {/* 4. Today's Medication Adherence Card */}
      <section className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm flex flex-col gap-3 border border-surface-container">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-[10.5px] text-secondary font-bold uppercase tracking-wider">
              Family Adherence Routine
            </span>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">Today's Regimen</h2>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-xs font-bold">
            {isArthurMedTaken ? '4 of 5 Taken' : '3 of 5 Taken'}
          </div>
        </div>

        {/* Multi-Segment Visual Progress Bar & Metric Dial */}
        <div className="flex items-center gap-3.5 bg-surface-container-low p-3.5 rounded-xl">
          {/* Circular Progress Ring */}
          <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle
                className="text-surface-container-high"
                cx="18"
                cy="18"
                fill="none"
                r="15.5"
                stroke="currentColor"
                strokeWidth="3"
              />
              <circle
                className="text-secondary"
                cx="18"
                cy="18"
                fill="none"
                r="15.5"
                stroke="currentColor"
                strokeDasharray="100"
                strokeDashoffset={isArthurMedTaken ? '20' : '40'}
                strokeLinecap="round"
                strokeWidth="3"
              />
            </svg>
            <span className="absolute font-data-metric text-base leading-none font-extrabold text-on-surface">
              {isArthurMedTaken ? '80%' : '60%'}
            </span>
          </div>

          <div className="flex flex-col flex-1 justify-center">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-md text-xs font-bold text-on-surface">Daily Compliance</span>
              <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">Goal: 100%</span>
            </div>
            {/* Segmented bar */}
            <div className="grid grid-cols-5 gap-1.5 h-2 w-full">
              <div className="bg-secondary rounded-full" />
              <div className="bg-secondary rounded-full" />
              <div className="bg-secondary rounded-full" />
              <div className={`${isArthurMedTaken ? 'bg-secondary' : 'bg-surface-variant animate-pulse'} rounded-full`} />
              <div className="bg-surface-container-high rounded-full" />
            </div>
            <p className="font-label-sm text-[11px] text-on-surface-variant mt-1.5">
              Next window opens at 1:00 PM for Maya (Vitamin D3)
            </p>
          </div>
        </div>

        {/* Timeline Schedule Preview */}
        <div className="flex flex-col gap-1.5 pt-1">
          <span className="font-label-sm text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">
            Scheduled Today
          </span>

          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
              <div>
                <p className="font-label-md text-xs font-semibold text-on-surface">Morning Window (8:00 AM)</p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  {isArthurMedTaken ? '3 doses recorded' : '2 doses recorded'} • Sarah, David, Arthur
                </p>
              </div>
            </div>
            <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-surface-container text-on-surface font-semibold">
              Done
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">radio_button_checked</span>
              <div>
                <p className="font-label-md text-xs font-semibold text-on-surface">Mid-day Window (1:00 PM)</p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">1 dose upcoming • Maya (Vitamin D3 Drops)</p>
              </div>
            </div>
            <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-bold">
              Up Next
            </span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-outline text-[20px]">schedule</span>
              <div>
                <p className="font-label-md text-xs font-semibold text-on-surface">Evening Window (8:30 PM)</p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">2 doses scheduled • Arthur &amp; David</p>
              </div>
            </div>
            <span className="font-label-sm text-[11px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant">
              Pending
            </span>
          </div>
        </div>
      </section>

      {/* 5. Family Profiles (Family Member Summary Cards) */}
      <section className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">family_restroom</span>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">Family Profiles</h2>
          </div>
          <button
            onClick={() => {
              setEditingMember(null);
              setActiveModal('mem');
            }}
            className="font-label-md text-xs text-primary font-bold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">person_add</span>
            Add Member
          </button>
        </div>

        {/* Arthur Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col gap-2.5 border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shrink-0 shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  alt="Arthur"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfy--dLW2pGiqDiO2mZhKLzU9bfhScskFY8GRsEpMzP0BLB5sUAdwh9xMgbHr6A1fx2u6ZkPHq21CNwUdfuP8atol6TDOyIdE5DzzGWPyMfigr90yBmrom5buripsp0SFWX9B0qVuDA3lWd9zYm2s26nxJ1jsXyCEvETxQKt2k5XVEtw9ahuCi4LFktgSHhRb0I7_OO4lkya5h1JQ4tTButOM4KE_j4OQkTxvn_gmV5wngpl9hd0f0"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-label-lg text-xs font-bold text-on-surface">Arthur Jenkins</h3>
                  <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px]">
                    72y • Father
                  </span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Blood Group: <span className="font-semibold text-on-surface">O+</span> • Type 2 Diabetes
                </p>
              </div>
            </div>
            <span className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">health_and_safety</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <div className="bg-surface-container-low p-2 rounded-xl flex flex-col">
              <span className="font-label-sm text-[10px] text-on-surface-variant font-medium">Blood Pressure</span>
              <span className="font-data-metric text-sm font-bold text-on-surface mt-0.5">
                128/82 <span className="font-normal text-[10px] text-on-surface-variant">mmHg</span>
              </span>
              <span className="font-label-sm text-[10px] text-secondary font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                Logged 7:45 AM
              </span>
            </div>
            <div className="bg-surface-container-low p-2 rounded-xl flex flex-col">
              <span className="font-label-sm text-[10px] text-on-surface-variant font-medium">30-Day Adherence</span>
              <span className="font-data-metric text-sm font-bold text-on-surface mt-0.5">85%</span>
              <span className="font-label-sm text-[10px] text-secondary font-semibold flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-[12px]">trending_up</span>
                Stable regimen
              </span>
            </div>
          </div>
        </div>

        {/* Maya Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col gap-2.5 border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shrink-0 shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  alt="Maya"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIuQ39CQ07qE_jDQnTlW3Mo4Ik-MpS6YsL8j_E2MQ-6mgJ_vuCJx07CVcLJZ8Wb1vWBtzY2LdWjIQbzlQi-sEgRvI6-WM21A_tvW-k0H4jSz-d1XSoJdo8Xniz9bHDIFoi4MHdMM0noBF7n1N9gKSgrBZdz9-3x4NJoqESEWo3kz-vLoAWa3gC0Y_AIRb7mnHh1sevJ6S7tTdEBP18O8tflo4aCvGIaNY4Swubqso56HeENO5Bm7XJ"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-label-lg text-xs font-bold text-on-surface">Maya Jenkins</h3>
                  <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px]">
                    8y • Daughter
                  </span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Blood Group: <span className="font-semibold text-on-surface">A+</span>
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[10.5px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">warning</span>
              Penicillin
            </span>
          </div>

          <div className="bg-surface-container-low p-2 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[19px]">stethoscope</span>
              <div>
                <p className="font-label-md text-xs font-semibold text-on-surface">Pediatric Checkup</p>
                <p className="font-body-sm text-[11px] text-on-surface-variant">Tomorrow • Dr. Emily Vance</p>
              </div>
            </div>
            <button
              onClick={() => setTab('sched')}
              className="min-h-[36px] px-2 font-label-sm text-xs text-primary font-bold hover:underline"
            >
              Agenda
            </button>
          </div>
        </div>

        {/* David Card */}
        <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col gap-2.5 border border-surface-container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl bg-surface-container overflow-hidden shrink-0 shadow-xs">
                <img
                  className="w-full h-full object-cover"
                  alt="David"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNYLAbrtBKMlLeJQeJoTMVgBYbgee3R9kqqLuvUO0hgKRWxEwrBO2oLzovqnnfYzBvcuFdvpFkVopUw3XtpbeGsUxjXznhj-lis1TtRWYZidu7Xs6CfpHqI_HoCRBwIbioJ2fT_MQ2LBwEHdnzRg7IyNzp9w2BAeVjdgDnKgwoD9jPWwxrdtZGQHsggr27szalKLJCreYF6SUgEyzTmY0DQ8CIqaJXzwLiBtv-w0vFFvuP_SkFKuE4"
                />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-label-lg text-xs font-bold text-on-surface">David Jenkins</h3>
                  <span className="px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px]">
                    38y • Spouse
                  </span>
                </div>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  Blood Group: <span className="font-semibold text-on-surface">O+</span> • Hypertension
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10.5px] font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">verified</span>
              100% Adherence
            </span>
          </div>
        </div>
      </section>

      {/* 6. Recent Health Activity Log */}
      <section className="flex flex-col gap-2 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[20px]">history</span>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">Recent Activity</h2>
          </div>
          <span className="font-label-sm text-[11px] text-on-surface-variant font-medium">Real-time sync</span>
        </div>

        <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm flex flex-col gap-3 border border-surface-container">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <p className="font-label-md text-xs font-bold text-on-surface">Arthur took Glipizide 5mg</p>
                <span className="font-label-sm text-[10px] text-on-surface-variant">8:15 AM</span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant">Logged via Smart Pill Dispenser</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">lab_profile</span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <p className="font-label-md text-xs font-bold text-on-surface">Maya's Lab Report Uploaded</p>
                <span className="font-label-sm text-[10px] text-on-surface-variant">Yesterday</span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Pediatric Blood Panel • Quest Diagnostics Regional
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-full bg-surface-container text-on-surface flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">favorite</span>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex items-center justify-between">
                <p className="font-label-md text-xs font-bold text-on-surface">David Blood Pressure Logged</p>
                <span className="font-label-sm text-[10px] text-on-surface-variant">Yesterday 9:15 PM</span>
              </div>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                Reading: <span className="font-semibold text-secondary">122/80 mmHg</span> (Optimal range)
              </p>
            </div>
          </div>
        </div>
      </section>

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

      {activeModal === 'vital' && (
        <VitalModal
          onClose={() => setActiveModal(null)}
          onSave={handleSaveVital}
        />
      )}
    </div>
  );
};
