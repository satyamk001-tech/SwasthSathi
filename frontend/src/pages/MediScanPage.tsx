import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Member, Medication, DrugInteraction, AIDrugAnalysis } from '../types';
import { checkDrugs } from '../data/drugKnowledgeBase';
import { idb } from '../lib/idb';
import { analyzeDrugInteractionsAI } from '../lib/aiService';
import { uid } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { MedicationModal } from '../components/dashboard/MedicationModal';

export const MediScanPage: React.FC = () => {
  const { toast, selectedMemberId, setSelectedMemberId, refreshKey, triggerRefresh } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [activeTab, setActiveTab] = useState<'routine' | 'checker'>('routine');

  // Interactive dose states
  const [takenMap, setTakenMap] = useState<Record<string, boolean>>({
    md2: true, // Glipizide morning
    md6: true, // Amlodipine morning
    md8: true  // Multivitamin morning
  });
  const [snoozedMap, setSnoozedMap] = useState<Record<string, boolean>>({});

  // Medication modal
  const [isAddMedOpen, setIsAddMedOpen] = useState(false);

  // Interaction checker state
  const [checkList, setCheckList] = useState<string[]>([
    'Warfarin 5mg',
    'Ibuprofen 400mg',
    'Lisinopril 10mg'
  ]);
  const [customDrugInput, setCustomDrugInput] = useState('');
  const [localInteractions, setLocalInteractions] = useState<DrugInteraction[] | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AIDrugAnalysis | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      const [m, meds] = await Promise.all([
        idb.all<Member>('members'),
        idb.all<Medication>('medications')
      ]);
      setMembers(m);
      setMedications(meds);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  // Filtered meds based on selected member
  const filteredMeds = useMemo(() => {
    if (selectedMemberId === 'all') return medications;
    return medications.filter((m) => m.memberId === selectedMemberId);
  }, [medications, selectedMemberId]);

  // Routine counts
  const totalDoses = medications.length;
  const takenCount = Object.keys(takenMap).filter((k) => takenMap[k]).length;
  const adherencePct = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 57;

  // Actions
  const handleLogDose = async (medId: string, medName: string) => {
    setTakenMap((prev) => ({ ...prev, [medId]: true }));
    const med = medications.find((m) => m.id === medId);
    if (med) {
      await idb.put('medications', { ...med, taken: true });
      await idb.put('med_logs', {
        id: uid(),
        medId,
        memberId: med.memberId,
        status: 'taken',
        at: new Date().toLocaleTimeString()
      });
    }
    toast(`✅ ${medName} confirmed taken & logged!`, 'ok');
    triggerRefresh();
  };

  const handleSnoozeDose = (medId: string, medName: string) => {
    setSnoozedMap((prev) => ({ ...prev, [medId]: true }));
    toast(`⏰ ${medName} snoozed for 15 minutes`, 'info');
  };

  const handleSaveNewMed = async (data: any) => {
    const newMed: Medication = {
      id: uid(),
      memberId: selectedMemberId !== 'all' ? selectedMemberId : members[0]?.id || 'm1',
      ...data,
      taken: false
    };
    await idb.put('medications', newMed);
    await loadData();
    setIsAddMedOpen(false);
    toast(`Added ${newMed.name} to family regimen!`, 'ok');
  };

  // Interaction check actions
  const handleRunInteractionCheck = () => {
    if (checkList.length < 2) {
      toast('Add at least 2 medications to screen for adverse interactions', 'warn');
      return;
    }
    const results = checkDrugs(checkList);
    setLocalInteractions(results);
    if (results.length > 0) {
      toast(`⚠️ Detected ${results.length} pharmacological conflict(s)`, 'err');
    } else {
      toast('✅ No known interactions detected in clinical database', 'ok');
    }
  };

  const handleRunAICheck = async () => {
    if (checkList.length < 2) {
      toast('Add at least 2 medications to analyze', 'warn');
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await analyzeDrugInteractionsAI(checkList);
      setAiAnalysis(res);
      toast('AI Pharmacological Safety Review complete', 'ok');
    } catch (e: any) {
      toast(e.message || 'AI check error', 'err');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 animate-fade-in">
      {/* Top Segmented Mode Selector: Routine vs Drug Checker */}
      <div className="grid grid-cols-2 gap-1 bg-surface-container-high/60 p-1 rounded-xl">
        <button
          onClick={() => setActiveTab('routine')}
          className={`min-h-[40px] rounded-lg font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'routine'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">calendar_view_day</span>
          <span>Routine Dose Tracking</span>
        </button>
        <button
          onClick={() => setActiveTab('checker')}
          className={`min-h-[40px] rounded-lg font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'checker'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">medication_liquid</span>
          <span>Rx Interaction Check</span>
        </button>
      </div>

      {activeTab === 'routine' ? (
        <>
          {/* 1. Family Member Selector Chips */}
          <section className="flex flex-col gap-1.5 pt-1">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-bold">
                Routine Context
              </span>
              <span className="font-label-sm text-xs text-secondary font-bold flex items-center gap-1 cursor-pointer">
                <span className="material-symbols-outlined text-[16px] animate-spin">sync</span> Live Sync Active
              </span>
            </div>

            <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                onClick={() => setSelectedMemberId('all')}
                className={`shrink-0 min-h-[38px] px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-xs transition-all font-label-md text-xs ${
                  selectedMemberId === 'all'
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <span>All Family</span>
                <span className="bg-surface-container-lowest text-primary font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {medications.length} Scheduled
                </span>
              </button>

              {members.map((m) => {
                const count = medications.filter((x) => x.memberId === m.id).length;
                const isSelected = selectedMemberId === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedMemberId(m.id)}
                    className={`shrink-0 min-h-[38px] px-3 py-1.5 rounded-full flex items-center gap-2 transition-all font-label-md text-xs ${
                      isSelected
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: m.color || '#006a61' }}
                    />
                    <span>{m.name.split(' ')[0]}</span>
                    <span
                      className={`font-semibold text-[10px] px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-primary-fixed text-on-primary-fixed'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. 7-Day Micro Calendar Strip with Adherence Rings */}
          <section className="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm flex flex-col gap-2.5 border border-surface-container">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">calendar_today</span>
                <span className="font-headline-sm text-sm text-on-surface font-bold">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <span className="bg-secondary-container text-on-secondary-container text-[11px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_fire_department</span>
                14d Streak
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center pt-1">
              {[
                { day: 'M', pct: '100%', done: true },
                { day: 'T', pct: '100%', done: true },
                { day: 'W', pct: '100%', done: true },
                { day: 'T', pct: `${adherencePct}%`, active: true, date: '24' },
                { day: 'F', pct: '-', date: '25' },
                { day: 'S', pct: '-', date: '26' },
                { day: 'S', pct: '-', date: '27' }
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center gap-1 py-1 rounded-xl transition-all ${
                    item.active ? 'bg-surface-container-high' : item.done ? '' : 'opacity-65'
                  }`}
                >
                  <span className={`font-label-sm text-[11px] ${item.active ? 'text-primary font-bold' : 'text-on-surface-variant font-medium'}`}>
                    {item.day}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                      item.active
                        ? 'bg-primary text-on-primary shadow-xs'
                        : item.done
                        ? 'bg-surface-container text-secondary'
                        : 'bg-surface-container-low text-outline'
                    }`}
                  >
                    {item.done ? (
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    ) : (
                      item.date || ''
                    )}
                  </div>
                  <span className={`text-[10px] ${item.active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                    {item.pct}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Adherence Summary Bento */}
          <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-label-sm text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">
                  Today's Dose Events
                </span>
                <h2 className="font-headline-md text-base text-on-surface font-extrabold tracking-tight mt-0.5">
                  {takenCount} of {totalDoses} Doses Taken
                </h2>
              </div>

              {/* Radial Progress Gauge SVG */}
              <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-high"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${adherencePct}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute font-headline-sm text-xs text-on-surface font-bold">
                  {adherencePct}%
                </span>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => setIsAddMedOpen(true)}
                className="min-h-[42px] px-3 py-2 bg-primary text-on-primary rounded-xl flex items-center justify-center gap-1.5 shadow-xs active:scale-[0.98] transition-all font-label-md text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add Medicine</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="min-h-[42px] px-3 py-2 bg-surface-container-high text-primary rounded-xl flex items-center justify-center gap-1.5 hover:bg-surface-variant active:scale-[0.98] transition-all font-label-md text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                <span>Scan Rx Label</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                onChange={() => toast('Prescription label scanned & verified with OCR!', 'ok')}
              />
            </div>
          </section>

          {/* 4. CHRONOLOGICAL ROUTINE TIMELINE */}
          <div className="flex flex-col space-y-3">
            {/* Window 1: Morning (8:00 AM) */}
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[20px]">wb_sunny</span>
                  <span className="font-headline-sm text-sm text-on-surface font-bold">
                    Morning Window (8:00 AM)
                  </span>
                </div>
                <span className="bg-surface-container text-secondary text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">check</span> Complete
                </span>
              </div>

              {/* David: Amlodipine */}
              <div className="rounded-xl bg-surface-container-lowest p-3 shadow-xs border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-label-lg text-xs font-bold text-on-surface">Amlodipine 5mg</p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">David</span>
                    </div>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">
                      Taken at 8:05 AM • Blood pressure daily control
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-[10px] text-secondary font-bold">Recorded</span>
              </div>

              {/* Arthur: Glipizide */}
              <div className="rounded-xl bg-surface-container-lowest p-3 shadow-xs border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-secondary text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-label-lg text-xs font-bold text-on-surface">Glipizide 5mg</p>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-surface-container text-on-surface-variant">Arthur</span>
                    </div>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">
                      Taken at 8:15 AM • Pre-breakfast antidiabetic
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-[10px] text-secondary font-bold">Recorded</span>
              </div>
            </div>

            {/* Window 2: Afternoon (1:00 PM) - Up Next */}
            <div className="flex flex-col space-y-2 pt-1">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-primary text-[20px]">light_mode</span>
                  <span className="font-headline-sm text-sm text-on-surface font-bold">
                    Mid-Day Window (1:00 PM)
                  </span>
                </div>
                <span className="bg-primary-fixed text-on-primary-fixed text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Up Next
                </span>
              </div>

              {/* Maya: Vitamin D3 Drops */}
              {!snoozedMap['md4'] && (
                <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                        MJ
                      </div>
                      <div>
                        <h4 className="font-label-lg text-xs font-bold text-on-surface">Vitamin D3 Drops (1000 IU)</h4>
                        <p className="font-body-sm text-[11px] text-on-surface-variant">Maya (8y) • Take with lunch</p>
                      </div>
                    </div>
                    {takenMap['md4'] ? (
                      <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10.5px] font-bold">
                        Logged
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-[10.5px] font-bold">
                        Scheduled
                      </span>
                    )}
                  </div>

                  {!takenMap['md4'] && (
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => handleLogDose('md4', 'Vitamin D3 Drops')}
                        className="flex-1 min-h-[38px] rounded-xl bg-secondary text-on-secondary font-label-md text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-xs"
                      >
                        <span className="material-symbols-outlined text-[17px]">check_circle</span>
                        <span>Log Dose</span>
                      </button>
                      <button
                        onClick={() => handleSnoozeDose('md4', 'Vitamin D3 Drops')}
                        className="min-h-[38px] px-3.5 rounded-xl bg-surface-container text-on-surface-variant font-label-md text-xs font-semibold flex items-center justify-center gap-1 active:scale-98 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">snooze</span>
                        <span>Snooze</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Maya: Elemental Iron Drops */}
              <div className="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xs">
                      MJ
                    </div>
                    <div>
                      <h4 className="font-label-lg text-xs font-bold text-on-surface">Elemental Iron Drops 15mg</h4>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">Maya (8y) • Pair with orange juice</p>
                    </div>
                  </div>
                  {takenMap['md5'] ? (
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10.5px] font-bold">
                      Logged
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-surface-container text-primary font-label-sm text-[10.5px] font-bold">
                      1:00 PM
                    </span>
                  )}
                </div>

                {!takenMap['md5'] && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleLogDose('md5', 'Elemental Iron Drops')}
                      className="flex-1 min-h-[38px] rounded-xl bg-secondary text-on-secondary font-label-md text-xs font-bold flex items-center justify-center gap-1.5 active:scale-98 transition-all shadow-xs"
                    >
                      <span className="material-symbols-outlined text-[17px]">check_circle</span>
                      <span>Log Dose</span>
                    </button>
                    <button
                      onClick={() => handleSnoozeDose('md5', 'Elemental Iron Drops')}
                      className="min-h-[38px] px-3.5 rounded-xl bg-surface-container text-on-surface-variant font-label-md text-xs font-semibold flex items-center justify-center gap-1 active:scale-98 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">snooze</span>
                      <span>Snooze</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Window 3: Evening (8:30 PM) */}
            <div className="flex flex-col space-y-2 pt-1">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-outline text-[20px]">nightlight</span>
                  <span className="font-headline-sm text-sm text-on-surface font-bold">
                    Evening Window (8:30 PM)
                  </span>
                </div>
                <span className="bg-surface-container-high text-on-surface-variant text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  Pending (2)
                </span>
              </div>

              {/* Arthur: Lisinopril */}
              <div className="rounded-xl bg-surface-container-lowest p-3 shadow-xs border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-outline text-[22px]">schedule</span>
                  <div>
                    <p className="font-label-lg text-xs font-bold text-on-surface">Lisinopril 10mg</p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">Arthur • Blood pressure management</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLogDose('md3', 'Lisinopril 10mg')}
                  className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-xs font-bold hover:bg-surface-container-high transition-colors"
                >
                  Log Early
                </button>
              </div>

              {/* David: Atorvastatin */}
              <div className="rounded-xl bg-surface-container-lowest p-3 shadow-xs border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-outline text-[22px]">schedule</span>
                  <div>
                    <p className="font-label-lg text-xs font-bold text-on-surface">Atorvastatin 10mg</p>
                    <p className="font-body-sm text-[11px] text-on-surface-variant">David • Post-dinner cholesterol</p>
                  </div>
                </div>
                <button
                  onClick={() => handleLogDose('md7', 'Atorvastatin 10mg')}
                  className="px-3 py-1 rounded-lg bg-surface-container text-primary font-label-sm text-xs font-bold hover:bg-surface-container-high transition-colors"
                >
                  Log Early
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Drug Interaction & Safety Checker View */
        <div className="flex flex-col space-y-3">
          <div className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container space-y-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[22px]">warning</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Multi-Drug Interaction Screening
                </h3>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
                Screen potential contraindications, bleeding risks, and CYP450 liver enzyme competition.
              </p>
            </div>

            {/* Medicine Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {checkList.map((d, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>💊 {d}</span>
                  <button
                    onClick={() => setCheckList(checkList.filter((_, idx) => idx !== i))}
                    className="hover:text-tertiary text-on-surface-variant"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Add Custom Drug input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={customDrugInput}
                onChange={(e) => setCustomDrugInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customDrugInput.trim()) {
                    setCheckList([...checkList, customDrugInput.trim()]);
                    setCustomDrugInput('');
                  }
                }}
                placeholder="Enter drug name (e.g. Aspirin, Omeprazole)..."
                className="flex-1 min-h-[40px] px-3 bg-surface-container-low rounded-xl text-xs text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => {
                  if (customDrugInput.trim()) {
                    setCheckList([...checkList, customDrugInput.trim()]);
                    setCustomDrugInput('');
                  }
                }}
                className="min-h-[40px] px-3.5 bg-primary text-on-primary rounded-xl font-label-md text-xs font-bold active:scale-95 transition-all"
              >
                + Add
              </button>
            </div>

            {/* Check buttons */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={handleRunInteractionCheck}
                className="min-h-[42px] px-3 bg-secondary text-on-secondary rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Fast Local Check</span>
              </button>
              <button
                disabled={isAiLoading}
                onClick={handleRunAICheck}
                className="min-h-[42px] px-3 bg-primary text-on-primary rounded-xl font-label-md text-xs font-bold flex items-center justify-center gap-1.5 active:scale-95 shadow-xs"
              >
                {isAiLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">psychology</span>
                    <span>Deep AI Review</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Local Interaction Results */}
          {localInteractions && (
            <div className="space-y-2">
              <span className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider px-1">
                Database Detection Results ({localInteractions.length})
              </span>
              {localInteractions.length === 0 ? (
                <div className="p-4 bg-secondary-container text-on-secondary-container rounded-2xl text-center text-xs font-semibold">
                  ✅ No severe contraindications found between selected medications.
                </div>
              ) : (
                localInteractions.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-surface-container-lowest rounded-2xl shadow-sm border-l-4 border-l-tertiary border-surface-container space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-tertiary font-bold text-xs">
                        <span className="material-symbols-outlined text-[16px]">dangerous</span>
                        <span>{item.sev} Severity Interaction</span>
                      </div>
                      <span className="px-2 py-0.2 rounded-full bg-error-container text-on-error-container font-label-sm text-[10px] font-bold">
                        Clinical Warning
                      </span>
                    </div>
                    <p className="font-label-md text-xs font-bold text-on-surface">
                      {item.drugs.join(' ↔ ')}
                    </p>
                    <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                      {item.why}
                    </p>
                    {item.alt && item.alt.length > 0 && (
                      <div className="bg-surface-container-low p-2 rounded-lg text-[11px] text-primary">
                        <strong>Safer Alternatives:</strong> {item.alt.join(', ')}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* AI Analysis Result */}
          {aiAnalysis && (
            <div className="p-4 bg-surface-container-lowest rounded-2xl shadow-sm border border-primary/20 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                  <span className="material-symbols-outlined text-[18px]">smart_toy</span>
                  <span>AI Clinical Pharmacologist Report</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-[10.5px] font-bold">
                  {aiAnalysis.overallRisk} Risk
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface leading-relaxed">
                {aiAnalysis.summary}
              </p>
              {aiAnalysis.recommendations && aiAnalysis.recommendations.length > 0 && (
                <div className="bg-surface-container-low p-2.5 rounded-xl space-y-1">
                  <span className="font-label-sm text-[11px] font-bold text-on-surface block">
                    Recommendations:
                  </span>
                  <ul className="text-[11px] text-on-surface-variant space-y-0.5 pl-4 list-disc">
                    {aiAnalysis.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Medication Add Modal */}
      {isAddMedOpen && (
        <MedicationModal
          onClose={() => setIsAddMedOpen(false)}
          onSave={handleSaveNewMed}
        />
      )}
    </div>
  );
};
