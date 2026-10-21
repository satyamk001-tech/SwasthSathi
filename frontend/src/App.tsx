import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { seedInitialData } from './lib/idb';
import { C } from './data/seedData';
import { Spin } from './components/common/Spinner';
import { Toast } from './components/common/Toast';
import { BottomNav } from './components/layout/BottomNav';
import { DashboardPage } from './pages/DashboardPage';
import { ScannerPage } from './pages/ScannerPage';
import { SchedulerPage } from './pages/SchedulerPage';
import { MediScanPage } from './pages/MediScanPage';
import { BotPage } from './pages/BotPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

const AppContent: React.FC = () => {
  const { tab, toasts, removeToast } = useApp();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    seedInitialData()
      .then(() => setReady(true))
      .catch((err) => {
        console.error('Seed error:', err);
        setReady(true);
      });
  }, []);

  if (!ready) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: 16,
          background: C.bg
        }}
      >
        <Spin size={12} color={C.blue} />
        <div style={{ fontWeight: 800, color: C.navy, fontSize: 16 }}>
          Loading SwasthSathi Health Assistant...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 430,
        margin: '0 auto',
        minHeight: '100vh',
        background: C.bg,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {/* Main Content Area */}
      <main
        style={{
          flex: 1,
          padding: tab === 'bot' ? '16px 14px 0' : '20px 14px 88px',
          overflowY: tab === 'bot' ? 'hidden' : 'auto',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {tab === 'dash' && <DashboardPage />}
        {tab === 'scanner' && <ScannerPage />}
        {tab === 'sched' && <SchedulerPage />}
        {tab === 'medi' && <MediScanPage />}
        {tab === 'bot' && <BotPage />}
        {tab === 'stats' && <AnalyticsPage />}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNav />

      {/* Floating Toast Notification Container */}
      <div
        style={{
          position: 'fixed',
          bottom: 84,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
          padding: '0 14px',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((t) => (
          <div key={t.id} style={{ pointerEvents: 'all', width: '100%' }}>
            <Toast msg={t.msg} type={t.type} onClose={() => removeToast(t.id)} />
          </div>
        ))}
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
