import React from 'react';
import { C } from '../../data/seedData';
import { useApp, TabId } from '../../context/AppContext';

interface TabItem {
  id: TabId;
  label: string;
  icon: string;
}

export const TABS: TabItem[] = [
  { id: 'dash', label: 'Home', icon: '⊞' },
  { id: 'scanner', label: 'Scanner', icon: '🔬' },
  { id: 'sched', label: 'Schedule', icon: '📅' },
  { id: 'medi', label: 'MediScan', icon: '💊' },
  { id: 'bot', label: 'AI Bot', icon: '🤖' },
  { id: 'stats', label: 'Stats', icon: '📊' }
];

export const BottomNav: React.FC = () => {
  const { tab, setTab } = useApp();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: `1px solid ${C.border}`,
        display: 'grid',
        gridTemplateColumns: `repeat(${TABS.length}, 1fr)`,
        padding: '6px 0 10px',
        zIndex: 500,
        boxShadow: '0 -2px 16px rgba(11,30,61,0.08)'
      }}
    >
      {TABS.map((t) => {
        const isActive = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '3px 0',
              color: isActive ? C.blue : C.muted,
              position: 'relative'
            }}
          >
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: -7,
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  background: C.blue
                }}
              />
            )}
            <span style={{ fontSize: 17, lineHeight: 1 }}>{t.icon}</span>
            <span style={{ fontSize: 9, fontWeight: isActive ? 800 : 500 }}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
