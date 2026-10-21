import React from 'react';
import { useApp, TabId } from '../../context/AppContext';

interface NavItem {
  id: TabId;
  label: string;
  icon: string;
  isAlert?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dash', label: 'Overview', icon: 'space_dashboard' },
  { id: 'family', label: 'Family', icon: 'diversity_1' },
  { id: 'medi', label: 'Meds', icon: 'pill' },
  { id: 'scanner', label: 'Labs', icon: 'clinical_notes' },
  { id: 'bot', label: 'AI Clinic', icon: 'smart_toy' },
  { id: 'sched', label: 'SOS', icon: 'e911_emergency', isAlert: true }
];

export const BottomNav: React.FC = () => {
  const { tab, setTab, setSosMode } = useApp();

  const handleSelect = (id: TabId) => {
    if (id === 'sched') {
      setSosMode(true);
    } else {
      setSosMode(false);
    }
    setTab(id);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-surface/95 backdrop-blur-xl border-t border-surface-container shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center h-16 max-w-[480px] mx-auto px-1">
        {NAV_ITEMS.map((item) => {
          const isActive = tab === item.id;
          const isSos = item.isAlert;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              className={`flex flex-col items-center justify-center min-w-[52px] min-h-[44px] py-1 transition-all rounded-lg active:scale-95 ${
                isActive
                  ? isSos
                    ? 'text-tertiary font-bold'
                    : 'text-primary font-bold'
                  : isSos
                  ? 'text-tertiary/80 hover:text-tertiary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{
                    fontVariationSettings: isActive ? "'FILL' 1, 'wght' 600" : "'FILL' 0, 'wght' 400"
                  }}
                >
                  {item.icon}
                </span>
                {isActive && (
                  <span
                    className={`absolute -bottom-1.5 w-1.5 h-1.5 rounded-full ${
                      isSos ? 'bg-tertiary' : 'bg-primary'
                    }`}
                  />
                )}
              </div>
              <span className="font-label-sm text-[10.5px] mt-0.5 tracking-tight leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
