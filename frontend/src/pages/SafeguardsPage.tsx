import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { idb } from '../lib/idb';
import { today } from '../lib/utils';
import { RiskAcknowledgmentModal } from '../components/safeguards/RiskAcknowledgmentModal';

export const SafeguardsPage: React.FC = () => {
  const {
    autoArchive,
    setAutoArchive,
    prioritySafeguard,
    setPrioritySafeguard,
    retentionPeriod,
    setRetentionPeriod,
    toast
  } = useApp();

  const [criticalLabAlerts, setCriticalLabAlerts] = useState(true);
  const [medReminders, setMedReminders] = useState(true);
  const [preVisitChecklist, setPreVisitChecklist] = useState(true);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showSafetyTooltip, setShowSafetyTooltip] = useState(false);

  const handleToggleAutoArchive = () => {
    if (autoArchive) {
      // Trying to turn off protection! Show risk confirmation modal
      setShowRiskModal(true);
    } else {
      setAutoArchive(true);
      setShowSafetyTooltip(false);
      toast('Auto-archive safeguard re-enabled', 'ok');
    }
  };

  const handleConfirmDisableArchive = () => {
    setAutoArchive(false);
    setShowSafetyTooltip(true);
  };

  const handleExportData = async () => {
    try {
      const all: Record<string, any[]> = {};
      const stores = ['members', 'medications', 'med_logs', 'lab_reports', 'appointments', 'vitals'] as const;
      for (const s of stores) {
        all[s] = await idb.all(s);
      }
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `swasthsathi_hipaa_export_${today()}.json`;
      a.click();
      toast('Clinical archive downloaded successfully', 'ok');
    } catch (e: any) {
      toast(`Export error: ${e.message}`, 'err');
    }
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-4 animate-fade-in">
      {/* 1. Profile & Account Header Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-primary-fixed/30 pointer-events-none blur-2xl" />
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                className="w-14 h-14 rounded-full object-cover shadow-sm ring-2 ring-surface-container"
                alt="Sarah Jenkins"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIzTV1iUMFC455-WQ2wvKCae_g8EvTrh8M0TfVlDonTu8ufPMeX593v3X1nEmgXou1lf74diUQQebz3U9vU6jdtjrl1RFOudqPJh47D5YcX9N8FX8nUUiPuTrn9p0imdYmOUKez3B5w-xHXPgpKkcHdhpZZqMagmDwLqWYkA4cM-ZfsSIlg9VTwdgJhwDIO0lqFLCDj2Rhz18TnEIgDpo2XmRpMEGIA4QyuGFUQcyAl-aSnF1eHNtX"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-secondary rounded-full flex items-center justify-center shadow-sm">
                <span className="material-symbols-outlined text-on-secondary text-[10px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
              </span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h2 className="font-headline-sm text-base font-bold text-on-surface tracking-tight">
                  Sarah Jenkins
                </h2>
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold">
                  Admin
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant truncate">
                sarah.jenkins@familycare.io
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-label-sm text-[11px] text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">diversity_3</span> 3 Managed Profiles
                </span>
                <span className="text-outline-variant font-label-sm text-[10px]">•</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant">Arthur, Maya, David</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Encryption Trust Strip */}
        <div className="mt-3 pt-2.5 bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-secondary/15 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined text-[16px]">fingerprint</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-md text-xs text-on-surface font-semibold leading-tight">
                Biometric Passcode
              </span>
              <span className="font-label-sm text-[10.5px] text-on-surface-variant">
                FaceID / TouchID Active
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface font-label-sm text-xs font-semibold">
            <span className="material-symbols-outlined text-secondary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
            <span>HIPAA Tier-3</span>
          </div>
        </div>
      </div>

      {/* 2. CLINICAL SAFEGUARDS SECTION */}
      <section className="flex flex-col w-full space-y-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
              <h3 className="font-headline-sm text-base font-bold text-on-surface tracking-tight">
                Clinical Agenda &amp; Safeguards
              </h3>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Configure AI lab findings, doctor inquiry triggers &amp; archive protections
            </p>
          </div>
        </div>

        {/* Safeguards Master Card */}
        <div className="w-full bg-surface-container-lowest rounded-2xl p-4 shadow-sm space-y-3.5">
          {/* Toggle 1: Auto-Archive Dismissed Questions */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-label-lg text-sm text-on-surface font-bold">
                    Auto-Archive Dismissed Questions
                  </span>
                  {autoArchive ? (
                    <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-[10.5px] font-bold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">check</span> Recommended
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 font-label-sm text-[10.5px] font-bold flex items-center gap-1">
                      <span>⚠️</span> Protection Inactive
                    </span>
                  )}
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  When removing clinical lab-flagged or doctor agenda questions, automatically preserve them in the child’s Visit Notes &amp; History archive rather than permanently deleting them.
                </p>
              </div>

              {/* Custom Switch Button */}
              <button
                type="button"
                role="switch"
                aria-checked={autoArchive}
                onClick={handleToggleAutoArchive}
                className={`shrink-0 w-12 h-7 rounded-full relative transition-colors focus:outline-none p-0.5 mt-1 cursor-pointer ${
                  autoArchive ? 'bg-primary' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`w-6 h-6 bg-surface-container-lowest rounded-full block shadow-sm transform transition-transform duration-200 ease-out flex items-center justify-center ${
                    autoArchive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[14px] ${autoArchive ? 'text-primary' : 'text-slate-500'}`}>
                    archive
                  </span>
                </span>
              </button>
            </div>

            {/* Safety Tooltip when inactive */}
            {(!autoArchive || showSafetyTooltip) && (
              <div className="w-full bg-amber-50 border-2 border-amber-400 rounded-xl p-3 shadow-md space-y-1.5 animate-fade-in">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <span>⚠️</span>
                  <span>Clinical Safety Warning: Permanent Deletion Risk</span>
                </div>
                <p className="font-body-sm text-xs text-amber-900 leading-snug">
                  Any dismissed agenda item will immediately be removed from both parent and clinician views without a backup record.
                </p>
                <button
                  onClick={() => {
                    setAutoArchive(true);
                    setShowSafetyTooltip(false);
                    toast('Auto-archive re-enabled for safety', 'ok');
                  }}
                  className="font-label-sm text-xs font-bold text-primary underline"
                >
                  Re-enable Protection Now
                </button>
              </div>
            )}
          </div>

          <div className="h-[1px] w-full bg-surface-container" />

          {/* Toggle 2: Require Safeguard Confirmation */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 pr-1">
              <span className="font-label-lg text-sm text-on-surface font-bold block mb-1">
                Safeguard Confirmation for Priority 1 Items
              </span>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Prompts with a clinical explanation before deleting any lab-correlated question (e.g., CBC hemoglobin trends or allergy flags).
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prioritySafeguard}
              onClick={() => {
                setPrioritySafeguard((prev) => !prev);
                toast(`Priority safeguard ${!prioritySafeguard ? 'enabled' : 'disabled'}`, 'info');
              }}
              className={`shrink-0 w-12 h-7 rounded-full relative transition-colors focus:outline-none p-0.5 mt-1 cursor-pointer ${
                prioritySafeguard ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-6 h-6 bg-surface-container-lowest rounded-full block shadow-sm transform transition-transform duration-200 ease-out flex items-center justify-center ${
                  prioritySafeguard ? 'translate-x-5' : 'translate-x-0'
                }`}
              >
                <span className={`material-symbols-outlined text-[14px] ${prioritySafeguard ? 'text-primary' : 'text-slate-500'}`}>
                  security
                </span>
              </span>
            </button>
          </div>

          {/* Retention Period Segmented Control */}
          <div className="bg-surface-container-low rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label-md text-xs text-on-surface font-bold">
                Auto-Archive Retention Period
              </span>
              <span className="font-label-sm text-[11px] text-primary font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">history</span> Clinical Compliance
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1 bg-surface-container-highest/60 p-1 rounded-lg">
              {(['6 Months', '1 Year', 'Indefinitely'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setRetentionPeriod(period);
                    toast(`Retention set to ${period}`, 'ok');
                  }}
                  className={`py-1.5 rounded text-center font-label-sm text-xs transition-all ${
                    retentionPeriod === period
                      ? 'bg-surface-container-lowest text-primary font-bold shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface font-medium'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>

          {/* Clinician trust note */}
          <div className="bg-primary/5 rounded-xl p-3 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary mt-0.5">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                shield
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface leading-snug">
              Clinical safety safeguard enabled. Archived agenda items remain accessible to{' '}
              <strong className="font-semibold text-primary">Dr. Emily Vance</strong> and your primary care team during post-visit reviews.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Notifications & Alerts Module */}
      <section className="flex flex-col w-full space-y-2">
        <div className="px-1">
          <h3 className="font-headline-sm text-base font-bold text-on-surface tracking-tight">
            Health Alerts &amp; Delivery
          </h3>
          <p className="font-body-sm text-xs text-on-surface-variant">
            Manage notification channels for acute findings and daily medications
          </p>
        </div>

        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm divide-y divide-surface-container overflow-hidden">
          {/* Item 1: Critical Labs */}
          <div className="p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">vital_signs</span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-lg text-xs text-on-surface font-bold truncate">
                    Critical Lab Result Alerts
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-[10px] font-bold">
                    SMS+Push
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Instant notice when lab values fall out of safe range
                </p>
              </div>
            </div>
            <button
              onClick={() => setCriticalLabAlerts(!criticalLabAlerts)}
              className={`shrink-0 w-11 h-6 rounded-full relative transition-colors focus:outline-none p-0.5 ${
                criticalLabAlerts ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 bg-surface-container-lowest rounded-full block shadow-sm transform transition-transform duration-200 ${
                  criticalLabAlerts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 2: Medication Reminders */}
          <div className="p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">medication</span>
              </div>
              <div className="min-w-0">
                <span className="font-label-lg text-xs text-on-surface font-bold truncate block">
                  Medication Routine Reminders
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Daily schedules for Arthur's Metformin &amp; Maya's supplements
                </p>
              </div>
            </div>
            <button
              onClick={() => setMedReminders(!medReminders)}
              className={`shrink-0 w-11 h-6 rounded-full relative transition-colors focus:outline-none p-0.5 ${
                medReminders ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 bg-surface-container-lowest rounded-full block shadow-sm transform transition-transform duration-200 ${
                  medReminders ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 3: Pre-Visit Reminders */}
          <div className="p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-surface-container-high text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[20px]">event_upcoming</span>
              </div>
              <div className="min-w-0">
                <span className="font-label-lg text-xs text-on-surface font-bold truncate block">
                  Pre-Visit Preparation Reminders
                </span>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  24h &amp; 2h notifications before scheduled appointments
                </p>
              </div>
            </div>
            <button
              onClick={() => setPreVisitChecklist(!preVisitChecklist)}
              className={`shrink-0 w-11 h-6 rounded-full relative transition-colors focus:outline-none p-0.5 ${
                preVisitChecklist ? 'bg-primary' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 bg-surface-container-lowest rounded-full block shadow-sm transform transition-transform duration-200 ${
                  preVisitChecklist ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 4. Care Team & Sharing Permissions */}
      <section className="flex flex-col w-full space-y-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h3 className="font-headline-sm text-base font-bold text-on-surface tracking-tight">
              Family &amp; Care Team Access
            </h3>
            <p className="font-body-sm text-xs text-on-surface-variant">
              Authorized clinical proxies and physicians
            </p>
          </div>
        </div>

        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm p-2 space-y-1">
          {/* Member 1: Spouse */}
          <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <img
                className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm"
                alt="David"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNYLAbrtBKMlLeJQeJoTMVgBYbgee3R9kqqLuvUO0hgKRWxEwrBO2oLzovqnnfYzBvcuFdvpFkVopUw3XtpbeGsUxjXznhj-lis1TtRWYZidu7Xs6CfpHqI_HoCRBwIbioJ2fT_MQ2LBwEHdnzRg7IyNzp9w2BAeVjdgDnKgwoD9jPWwxrdtZGQHsggr27szalKLJCreYF6SUgEyzTmY0DQ8CIqaJXzwLiBtv-w0vFFvuP_SkFKuE4"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-lg text-xs text-on-surface font-bold truncate">
                    David Jenkins
                  </span>
                  <span className="font-label-sm text-[11px] text-on-surface-variant">(Spouse)</span>
                </div>
                <span className="font-label-sm text-[10.5px] text-secondary font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">key</span> Full Access &amp; Proxy Signer
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-[20px]">chevron_right</span>
          </div>

          {/* Member 2: Pediatrician */}
          <div className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-sm shrink-0">
                EV
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-label-lg text-xs text-on-surface font-bold truncate">
                    Dr. Emily Vance, MD
                  </span>
                  <span className="bg-secondary/10 text-secondary px-1.5 rounded font-label-sm text-[10px] font-bold">
                    Pediatrics
                  </span>
                </div>
                <span className="font-label-sm text-[10.5px] text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-primary">edit_note</span> Read/Write Clinical Agenda
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-outline-variant text-[20px]">chevron_right</span>
          </div>
        </div>
      </section>

      {/* 5. Data Export & Portability Action */}
      <div className="pt-2">
        <button
          onClick={handleExportData}
          className="w-full min-h-[46px] rounded-xl bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-xs font-bold flex items-center justify-center gap-2 active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">download_for_offline</span>
          <span>Export Complete Family Health Archive (.JSON)</span>
        </button>
      </div>

      {/* Risk Confirmation Modal */}
      <RiskAcknowledgmentModal
        isOpen={showRiskModal}
        onClose={() => setShowRiskModal(false)}
        onConfirm={handleConfirmDisableArchive}
      />
    </div>
  );
};
