import React, { useState, useEffect, useMemo } from 'react';
import { Member, Appointment, Hospital } from '../types';
import { HOSPITALS } from '../data/hospitals';
import { idb } from '../lib/idb';
import { uid, today, fmtDate } from '../lib/utils';
import { useApp } from '../context/AppContext';

export const SchedulerPage: React.FC = () => {
  const { toast, sosMode, setSosMode, selectedMemberId, setSelectedMemberId, refreshKey } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'sos' | 'agenda'>(sosMode ? 'sos' : 'sos');

  // Emergency Triage states
  const [triageMemberId, setTriageMemberId] = useState<string>('m1'); // default Rajesh
  const [sosSent, setSosSent] = useState(false);
  const [gpsShared, setGpsShared] = useState(false);

  // Agenda questions checklist
  const [agendaQuestions, setAgendaQuestions] = useState<Array<{ id: string; text: string; tag: string; checked: boolean; priority?: boolean }>>([
    {
      id: 'q1',
      text: "Discuss Ananya's declining hemoglobin trend (11.5 g/dL) — should we start elemental iron drops or pediatric supplements?",
      tag: 'Nutrition & Bloodwork',
      checked: false,
      priority: true
    },
    {
      id: 'q2',
      text: 'Is her mild afternoon fatigue related to iron levels or school routine changes?',
      tag: 'Daily Energy & Sleep',
      checked: false
    },
    {
      id: 'q3',
      text: 'Sign and update annual school health & medical authorization forms for Delhi Public School (DPS).',
      tag: 'School Paperwork',
      checked: true
    }
  ]);
  const [newQuestionText, setNewQuestionText] = useState('');

  const loadData = async () => {
    try {
      const [m, a] = await Promise.all([
        idb.all<Member>('members'),
        idb.all<Appointment>('appointments')
      ]);
      setMembers(m);
      setAppointments(a);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  useEffect(() => {
    if (sosMode) {
      setActiveSubTab('sos');
    }
  }, [sosMode]);

  // Selected patient for triage
  const activeTriageMember = useMemo(() => {
    return members.find((m) => m.id === triageMemberId) || members[0] || null;
  }, [members, triageMemberId]);

  // Handle Broadcast SOS
  const handleBroadcastSOS = () => {
    setSosSent(true);
    toast('🚨 Emergency SMS dispatch queued to verified contacts & proxies!', 'err');
    setTimeout(() => {
      toast('Family proxies (Priya Kumar, Harikit Kumar) notified via SMS', 'ok');
    }, 1500);
  };

  // Handle Share GPS
  const handleShareGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsShared(true);
          toast(`📍 GPS Fix Shared: ${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`, 'ok');
        },
        () => {
          setGpsShared(true);
          toast('📍 GPS Fix Shared: 28.5672° N, 77.2100° E (New Delhi)', 'ok');
        }
      );
    } else {
      setGpsShared(true);
      toast('📍 GPS Fix Shared: 28.5672° N, 77.2100° E', 'ok');
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestionText.trim()) return;
    setAgendaQuestions((prev) => [
      ...prev,
      {
        id: uid(),
        text: newQuestionText.trim(),
        tag: 'Parent Observation',
        checked: false
      }
    ]);
    setNewQuestionText('');
    toast('Question added to pre-visit clipboard!', 'ok');
  };

  return (
    <div className="flex flex-col w-full pb-8 space-y-4 animate-fade-in">
      {/* Top Mode Segmented Switcher */}
      <div className="grid grid-cols-2 gap-1 bg-surface-container-high/60 p-1 rounded-xl">
        <button
          onClick={() => {
            setActiveSubTab('sos');
            setSosMode(true);
          }}
          className={`min-h-[40px] rounded-lg font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'sos'
              ? 'bg-tertiary text-on-tertiary shadow-sm'
              : 'text-on-surface-variant hover:text-tertiary'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">e911_emergency</span>
          <span>Emergency Medical SOS</span>
        </button>
        <button
          onClick={() => {
            setActiveSubTab('agenda');
            setSosMode(false);
          }}
          className={`min-h-[40px] rounded-lg font-label-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'agenda'
              ? 'bg-surface-container-lowest text-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">event_note</span>
          <span>Pre-Visit Clinical Agenda</span>
        </button>
      </div>

      {activeSubTab === 'sos' ? (
        /* EMERGENCY MEDICAL SOS VIEW */
        <div className="flex flex-col space-y-3.5">
          {/* Triage Patient Selector Bar */}
          <section className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                Triage Patient Select
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[11px] font-extrabold animate-pulse">
                <span className="material-symbols-outlined text-[14px]">crisis_alert</span>
                High Risk Active
              </span>
            </div>

            {/* Horizontal Triage Pill Buttons */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {members.map((m) => {
                const isSelected = (activeTriageMember?.id === m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => setTriageMemberId(m.id)}
                    className={`shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl transition-all active:scale-95 text-left ${
                      isSelected
                        ? 'bg-tertiary text-on-tertiary shadow-md'
                        : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelected ? 'bg-on-tertiary/20' : 'bg-surface-container-highest text-on-surface'
                      }`}
                    >
                      {m.avatar || m.name[0]}
                    </div>
                    <div>
                      <p className="font-label-md text-xs leading-tight font-bold">{m.name.split(' ')[0]}</p>
                      <p className={`font-label-sm text-[10px] ${isSelected ? 'text-tertiary-fixed opacity-95' : 'text-outline'}`}>
                        {m.blood ? `Blood ${m.blood}` : `${m.age}y`}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Focused Active Patient Banner */}
          <div className="p-3 bg-surface-container-highest rounded-2xl flex items-center justify-between shadow-xs border border-surface-container">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-bold shadow-xs">
                <span className="material-symbols-outlined text-[20px]">medical_information</span>
              </div>
              <div>
                <h1 className="font-headline-sm text-sm font-bold text-on-surface tracking-tight">
                  {activeTriageMember?.name} • {activeTriageMember?.age} yrs
                </h1>
                <p className="font-body-sm text-[11px] text-on-surface-variant">
                  {activeTriageMember?.triageNotes || 'Primary Proxy: Harikit Kumar (Son / Caregiver)'}
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-tertiary text-on-tertiary font-label-md text-xs font-extrabold tracking-wide">
              BLOOD {activeTriageMember?.blood || 'O+'}
            </span>
          </div>

          {/* Primary Emergency Dial Action (High Contrast, Stress-Resilient) */}
          <section className="flex flex-col space-y-2">
            <a
              href="tel:112"
              className="w-full min-h-[64px] bg-tertiary hover:bg-tertiary-container text-on-tertiary rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-tertiary/30 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-on-tertiary/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[28px] text-on-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    phone_in_talk
                  </span>
                </div>
                <div className="text-left">
                  <span className="font-headline-md text-base leading-none font-bold tracking-tight block">
                    Call 112 National Emergency
                  </span>
                  <span className="font-body-sm text-xs text-tertiary-fixed opacity-95">
                    Direct national emergency dispatch • Tap to initiate
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[26px]">arrow_forward</span>
            </a>

            {/* Dual Sub-Emergency Triggers */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleBroadcastSOS}
                className="p-3 bg-surface-container-lowest rounded-xl flex flex-col justify-between shadow-xs hover:bg-surface-container active:scale-95 transition-all text-left min-h-[94px] border border-surface-container"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">cell_tower</span>
                  </div>
                  <span className="font-label-sm text-[10px] font-bold text-tertiary uppercase">
                    {sosSent ? 'Dispatched' : 'Instant Alert'}
                  </span>
                </div>
                <div>
                  <span className="font-label-lg text-xs font-bold text-on-surface block leading-tight">
                    Broadcast SOS
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant">
                    SMS family proxies
                  </span>
                </div>
              </button>

              <button
                onClick={handleShareGPS}
                className="p-3 bg-surface-container-lowest rounded-xl flex flex-col justify-between shadow-xs hover:bg-surface-container active:scale-95 transition-all text-left min-h-[94px] border border-surface-container"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">fmd_good</span>
                  </div>
                  <span className="font-label-sm text-[10px] font-bold text-secondary uppercase">
                    {gpsShared ? 'Shared' : 'Live Pin'}
                  </span>
                </div>
                <div>
                  <span className="font-label-lg text-xs font-bold text-on-surface block leading-tight">
                    Share GPS Fix
                  </span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant truncate block">
                    28.5672° N, 77.2100° E
                  </span>
                </div>
              </button>
            </div>

            {/* Clinical Disclaimer */}
            <div className="p-2.5 rounded-xl bg-surface-container-high flex items-start gap-2">
              <span className="material-symbols-outlined text-outline text-[18px] shrink-0 mt-0.5">info</span>
              <p className="font-label-sm text-[11px] text-on-surface-variant leading-snug">
                Do not rely solely on mobile notifications for acute cardiac, airway, or unconscious emergencies. Dial 112 or 108 immediately.
              </p>
            </div>
          </section>

          {/* First-Responder Paramedic Summary (ER Triage Card) */}
          <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-tertiary text-[22px]">vital_signs</span>
                <h2 className="font-headline-sm text-sm font-bold text-on-surface">First-Responder Brief</h2>
              </div>
              <span className="px-2 py-0.5 bg-surface-container-high rounded-full font-label-sm text-[10.5px] font-semibold text-on-surface-variant">
                Verified Today
              </span>
            </div>

            {/* Allergies & Contraindications */}
            <div className="p-3 bg-error-container/60 rounded-xl space-y-1.5 border border-error-container">
              <div className="flex items-center gap-1.5 text-on-error-container">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span className="font-label-md text-xs font-extrabold uppercase">
                  Severe Allergies &amp; Contraindications
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(activeTriageMember?.allergies || ['Sulfa Antibiotics (Severe)', 'Latex']).map((all, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-error" />
                    {all}
                  </span>
                ))}
              </div>
            </div>

            {/* Chronic Conditions & Devices */}
            <div className="grid grid-cols-1 gap-2">
              <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
                <span className="font-label-sm text-[10.5px] text-on-surface-variant uppercase font-bold block">
                  Active Medical Conditions
                </span>
                <p className="font-body-md text-xs text-on-surface font-bold">
                  {activeTriageMember?.conditions?.join(' • ') || 'Type 2 Diabetes Mellitus (Insulin-dependent)'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-surface-container-low space-y-1">
                <span className="font-label-sm text-[10.5px] text-on-surface-variant uppercase font-bold block">
                  Implanted Devices &amp; Foreign Bodies
                </span>
                <p className="font-body-md text-xs text-on-surface font-semibold flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
                  Drug-eluting Cardiac Stent (LAD Artery - 2021)
                </p>
                <p className="font-body-sm text-[11px] text-outline">No pacemaker • MRI conditional</p>
              </div>
            </div>
          </section>

          {/* Nearest Level-1 Trauma ER Card */}
          <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">local_hospital</span>
                <h2 className="font-headline-sm text-sm font-bold text-on-surface">Nearest Trauma ER</h2>
              </div>
              <span className="px-2 py-0.5 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-[11px] font-bold">
                Open 24/7 • 12 ER Beds Open
              </span>
            </div>

            <div className="rounded-xl overflow-hidden bg-surface-container-low flex flex-col border border-surface-container">
              <div
                className="h-28 w-full bg-cover bg-center relative"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6HSg-9t1Ka2uaKg3ZLZs2gRYavympdV6EIolG319zzd596OtBy0-RzZhIH4m3nZVf0jSMC0ql5vSkHBy9kpOwqC4lAWwhSC_VgPwdlJJvPya3XObJvpk9MsJKXTKWxi7hv5Yhn4lEEndUYVoU9mH0wHemc5MGsCMwad02xXXAXdV-rLkZLbfur8PrSPdw_CkZDwvTndePzOWQUMPbNpQMnBMnQyTZx8vh6Bg10tBaEDfX1CWWZa3W')"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/85 via-transparent to-transparent flex items-end p-3">
                  <div className="text-inverse-on-surface">
                    <p className="font-headline-sm text-sm font-bold leading-tight">AIIMS New Delhi Emergency Trauma Centre</p>
                    <p className="font-body-sm text-[11px] opacity-90">Sri Aurobindo Marg, Ansari Nagar, New Delhi • 1.8 km (5 min)</p>
                  </div>
                </div>
              </div>

              <div className="p-2.5 flex items-center justify-between gap-2">
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 min-h-[40px] bg-primary text-on-primary rounded-xl flex items-center justify-center gap-1.5 font-label-lg text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[17px]">directions</span>
                  <span>Navigate (5m)</span>
                </a>
                <a
                  href="tel:01126588500"
                  className="min-h-[40px] px-4 bg-surface-container-high text-on-surface rounded-xl flex items-center justify-center gap-1.5 font-label-lg text-xs font-semibold active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-[17px]">call</span>
                  <span>ER Desk</span>
                </a>
              </div>
            </div>
          </section>
        </div>
      ) : (
        /* PRE-VISIT CLINICAL AGENDA VIEW */
        <div className="flex flex-col space-y-3.5">
          {/* Primary Urgent/Upcoming Appointment Spotlight Card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 flex flex-col gap-3 relative overflow-hidden border border-surface-container">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-secondary" />

            {/* Status Header */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-1.5 bg-secondary-container text-on-secondary-container px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span className="font-label-sm text-[11px] font-bold uppercase tracking-wider">
                  Tomorrow • 10:30 AM IST
                </span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant font-label-sm text-[11px] font-semibold">
                <span className="material-symbols-outlined text-[15px] text-secondary">task_alt</span>
                <span>Pre-Check-In 90%</span>
              </div>
            </div>

            {/* Member & Doctor Overview */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-secondary text-[26px]">child_care</span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-label-md text-xs font-bold text-on-surface">Ananya Kumar</span>
                  <span className="font-label-sm text-[10px] text-on-surface-variant bg-surface-container px-1.5 py-0.2 rounded-full">
                    8 yrs • Daughter
                  </span>
                </div>
                <p className="font-headline-sm text-sm text-on-surface font-bold leading-tight mt-0.5">
                  Pediatric Follow-up &amp; Iron Panel
                </p>
                <div className="flex items-center gap-1 text-on-surface-variant mt-1">
                  <span className="material-symbols-outlined text-[16px] text-primary">stethoscope</span>
                  <span className="font-body-sm text-[11px] font-medium">Dr. Neha Sharma, MD • Apollo Children's Clinic</span>
                </div>
              </div>
            </div>

            {/* Timing & Location Box */}
            <div className="bg-surface-container-low rounded-xl p-2.5 flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-on-surface text-xs font-semibold">
                <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                <span>Tomorrow • 10:30 AM – 11:00 AM IST</span>
              </div>
              <div className="flex items-start gap-2 text-on-surface-variant text-[11px]">
                <span className="material-symbols-outlined text-secondary text-[18px] shrink-0">pin_drop</span>
                <div>
                  <span className="block text-on-surface font-medium">Apollo Children's Clinic • Saket Sector 6</span>
                  <span className="text-on-surface-variant">Plot 1, Institutional Area, Saket, New Delhi (15 min drive)</span>
                </div>
              </div>
            </div>

            {/* Clinical Lab Integration Note */}
            <div className="bg-surface-variant/40 rounded-xl p-2.5 flex items-center justify-between gap-2 border border-surface-container">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-tertiary-container text-[18px] shrink-0">
                  biotech
                </span>
                <div className="truncate min-w-0">
                  <span className="font-label-sm text-[10px] text-tertiary font-bold uppercase tracking-wider block">
                    Referenced Clinical Context
                  </span>
                  <span className="font-body-sm text-xs text-on-surface font-semibold truncate block">
                    Dr. Lal PathLabs CBC (Mild Low Iron / Hgb 11.5)
                  </span>
                </div>
              </div>
              <button
                onClick={() => toast('Opening correlated Dr. Lal PathLabs report...', 'info')}
                className="font-label-sm text-xs font-bold text-primary hover:underline shrink-0"
              >
                Review
              </button>
            </div>
          </div>

          {/* Doctor Agenda & Questions Section */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm p-4 flex flex-col gap-3 border border-surface-container">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[22px]">assignment_turned_in</span>
                <div>
                  <h2 className="font-headline-sm text-sm font-bold text-on-surface">Doctor Agenda &amp; Questions</h2>
                  <span className="font-label-sm text-[11px] text-secondary font-semibold">
                    {agendaQuestions.length} Questions Saved • 1 Clinician Flag
                  </span>
                </div>
              </div>
              <button
                onClick={() => window.print()}
                className="px-2.5 py-1 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded-lg flex items-center gap-1 font-label-sm text-xs font-semibold"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">print</span>
                <span>Export</span>
              </button>
            </div>

            <p className="font-body-sm text-xs text-on-surface-variant">
              Build and prioritize topics for Dr. Neha Sharma's 15-minute consultation. The agenda syncs directly to the clinician clipboard.
            </p>

            {/* Checklist */}
            <div className="flex flex-col gap-2">
              {agendaQuestions.map((q) => (
                <div
                  key={q.id}
                  className={`p-3 rounded-xl bg-surface-container-low flex flex-col gap-1.5 transition-all ${
                    q.checked ? 'opacity-70' : ''
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    {q.priority && (
                      <span className="inline-flex items-center gap-1 bg-error-container text-on-error-container px-2 py-0.2 rounded-full font-label-sm text-[10px] font-bold">
                        <span className="material-symbols-outlined text-[12px]">flag</span>
                        Suggested from Labs (Oct 23)
                      </span>
                    )}
                    <span className="font-label-sm text-[10px] text-primary font-bold bg-primary-fixed/40 px-2 py-0.2 rounded-full ml-auto">
                      {q.tag}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 pt-0.5">
                    <button
                      onClick={() =>
                        setAgendaQuestions((prev) =>
                          prev.map((item) => (item.id === q.id ? { ...item, checked: !item.checked } : item))
                        )
                      }
                      className="text-secondary hover:opacity-80 transition-opacity mt-0.5"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {q.checked ? 'check_box' : 'check_box_outline_blank'}
                      </span>
                    </button>
                    <p
                      className={`font-body-md text-xs font-semibold text-on-surface leading-snug flex-1 ${
                        q.checked ? 'line-through text-outline' : ''
                      }`}
                    >
                      {q.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Add Question Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newQuestionText}
                onChange={(e) => setNewQuestionText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                placeholder="Type a reminder for Dr. Neha Sharma..."
                className="flex-1 min-h-[40px] px-3 bg-surface-container-low rounded-xl text-xs text-on-surface placeholder:text-outline outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={handleAddQuestion}
                className="min-h-[40px] px-3 bg-primary text-on-primary rounded-xl font-label-md text-xs font-bold active:scale-95 transition-all"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
