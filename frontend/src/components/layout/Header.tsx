import React from 'react';
import { useApp, TabId } from '../../context/AppContext';
import { idb } from '../../lib/idb';
import { today } from '../../lib/utils';
import { Member } from '../../types';

interface HeaderProps {
  members?: Member[];
  onOpenSettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ members = [], onOpenSettings }) => {
  const { tab, setTab, setSosMode, selectedMemberId, setSelectedMemberId, toast } = useApp();

  const handleSOS = () => {
    setSosMode(true);
    setTab('sched');
  };

  const handleExportAll = async () => {
    try {
      const all: Record<string, any[]> = {};
      const stores = ['members', 'medications', 'med_logs', 'lab_reports', 'appointments', 'vitals'] as const;
      for (const s of stores) {
        all[s] = await idb.all(s);
      }
      const blob = new Blob([JSON.stringify(all, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `swasthsathi_health_record_${today()}.json`;
      a.click();
      toast('Family health records exported successfully!', 'ok');
    } catch (e: any) {
      toast(`Export failed: ${e.message}`, 'err');
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-surface-container shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="max-w-[480px] mx-auto px-4 py-2.5 flex flex-col gap-2">
        {/* Top utility row */}
        <div className="flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform"
            onClick={() => setTab('dash')}
          >
            <span className="material-symbols-outlined text-secondary text-[26px]">shield_with_heart</span>
            <div className="flex flex-col">
              <span className="font-headline-sm text-[1.1rem] leading-none tracking-tight text-on-surface font-extrabold flex items-center gap-1.5">
                FamilyCare
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-full bg-primary-fixed text-on-primary-fixed">
                  SwasthSathi
                </span>
              </span>
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2">
            {/* Export data button */}
            <button
              onClick={handleExportAll}
              title="Export Health Records"
              aria-label="Export Data"
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[19px]">download</span>
            </button>

            {/* Safeguards / Settings button */}
            <button
              onClick={() => (onOpenSettings ? onOpenSettings() : setTab('safeguards'))}
              title="Clinical Safeguards & Settings"
              aria-label="Clinical Settings"
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 ${
                tab === 'safeguards'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
            </button>

            {/* Fast SOS High Priority Button */}
            <button
              aria-label="Emergency Medical SOS"
              onClick={handleSOS}
              className="min-h-[38px] px-3.5 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center gap-1.5 shadow-[0_2px_8px_rgba(186,0,53,0.3)] hover:opacity-95 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px] animate-pulse">e911_emergency</span>
              <span className="font-label-md text-xs uppercase tracking-wider font-extrabold">SOS</span>
            </button>
          </div>
        </div>

        {/* Horizontal Member Context Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
          <button
            onClick={() => setSelectedMemberId('all')}
            className={`min-h-[34px] px-3 py-1 rounded-full flex items-center gap-1.5 shrink-0 transition-all font-label-sm text-xs font-semibold ${
              selectedMemberId === 'all'
                ? 'bg-primary text-on-primary shadow-[0_1px_4px_rgba(0,97,148,0.25)]'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">family_restroom</span>
            <span>All Family</span>
          </button>

          {members.map((m) => {
            const isSelected = selectedMemberId === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMemberId(m.id)}
                className={`min-h-[34px] px-2.5 py-1 rounded-full flex items-center gap-1.5 shrink-0 transition-all font-label-sm text-xs font-medium ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-[0_1px_4px_rgba(0,97,148,0.25)] font-semibold'
                    : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: m.color || '#006a61' }}
                />
                <span>{m.name.split(' ')[0]}</span>
                {m.allergies && m.allergies.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
