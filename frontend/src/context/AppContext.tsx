import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { uid } from '../lib/utils';

export type TabId = 'dash' | 'scanner' | 'sched' | 'medi' | 'bot' | 'stats';
export type ToastType = 'ok' | 'err' | 'warn' | 'info';

export interface ToastItem {
  id: string;
  msg: string;
  type: ToastType;
}

interface AppContextValue {
  tab: TabId;
  setTab: (t: TabId) => void;
  toasts: ToastItem[];
  toast: (msg: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  sosMode: boolean;
  setSosMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  triggerRefresh: () => void;
  refreshKey: number;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tab, setTab] = useState<TabId>('dash');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [sosMode, setSosMode] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const triggerRefresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((q) => q.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((msg: string, type: ToastType = 'ok') => {
    const id = uid();
    setToasts((q) => [...q, { id, msg, type }]);
    setTimeout(() => {
      setToasts((q) => q.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <AppContext.Provider
      value={{
        tab,
        setTab,
        toasts,
        toast,
        removeToast,
        sosMode,
        setSosMode,
        triggerRefresh,
        refreshKey
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextValue => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
