import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { seedInitialData, idb } from './lib/idb';
import { Member } from './types';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { SchedulerPage } from './pages/SchedulerPage';
import { MediScanPage } from './pages/MediScanPage';
import { BotPage } from './pages/BotPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { FamilyPage } from './pages/FamilyPage';
import { SafeguardsPage } from './pages/SafeguardsPage';
import { RiskAcknowledgmentModal } from './components/safeguards/RiskAcknowledgmentModal';

const AppContent: React.FC = () => {
  const {
    tab,
    toasts,
    removeToast,
    refreshKey,
    riskModalOpen,
    setRiskModalOpen,
    riskActionCallback
  } = useApp();

  const [ready, setReady] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);

  useEffect(() => {
    seedInitialData()
      .then(async () => {
        const m = await idb.all<Member>('members');
        setMembers(m);
        setReady(true);
      })
      .catch((err) => {
        console.error('Seed error:', err);
        setReady(true);
      });
  }, [refreshKey]);

  if (!ready) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-on-surface gap-3 p-6">
        <div className="w-12 h-12 rounded-full bg-secondary-container text-secondary flex items-center justify-center animate-spin">
          <span className="material-symbols-outlined text-[28px]">shield_with_heart</span>
        </div>
        <div className="font-headline-sm text-base font-bold text-on-surface tracking-tight">
          SwasthSathi Clinical Platform
        </div>
        <div className="font-body-sm text-xs text-on-surface-variant">
          Initializing offline encrypted records...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[480px] mx-auto min-h-screen bg-background flex flex-col relative text-on-surface font-sans">
      {/* Sticky Modern Top Header */}
      <Header members={members} />

      {/* Main Content Area */}
      <main className="flex-1 w-full px-4 pt-24 pb-24 overflow-y-auto">
        {tab === 'dash' && <DashboardPage />}
        {tab === 'family' && <FamilyPage />}
        {tab === 'medi' && <MediScanPage />}
        {tab === 'scanner' && <ScannerPage />}
        {tab === 'sched' && <SchedulerPage />}
        {tab === 'safeguards' && <SafeguardsPage />}
        {tab === 'bot' && <BotPage />}
        {tab === 'stats' && <AnalyticsPage />}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav />

      {/* Risk Acknowledgment Confirmation Modal */}
      {riskModalOpen && (
        <RiskAcknowledgmentModal
          isOpen={riskModalOpen}
          onClose={() => setRiskModalOpen(false)}
          onConfirm={() => {
            if (riskActionCallback) riskActionCallback();
          }}
        />
      )}

      {/* Floating Modern Toast Notifications */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center w-full max-w-[440px] px-4 pointer-events-none">
        {toasts.map((t) => {
          const isErr = t.type === 'err';
          const isWarn = t.type === 'warn';
          return (
            <div
              key={t.id}
              className={`pointer-events-auto w-full p-3.5 rounded-xl shadow-lg border flex items-center justify-between gap-2.5 animate-slide-up ${
                isErr
                  ? 'bg-error-container text-on-error-container border-tertiary-fixed-dim'
                  : isWarn
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-secondary text-on-secondary border-secondary-fixed'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[20px] shrink-0">
                  {isErr ? 'crisis_alert' : isWarn ? 'warning' : 'check_circle'}
                </span>
                <span className="font-label-md text-xs font-semibold leading-snug truncate">
                  {t.msg}
                </span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="opacity-70 hover:opacity-100 transition-opacity p-0.5"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
