import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { uid } from '../lib/utils';

export type TabId = 'dash' | 'scanner' | 'sched' | 'medi' | 'bot' | 'stats' | 'family' | 'safeguards';
export type ToastType = 'ok' | 'err' | 'warn' | 'info';

export interface ToastItem {
  id: string;
  msg: string;
  type: ToastType;
}

interface AppContextValue {
  tab: TabId;
  setTab: (t: TabId) => void;
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  toasts: ToastItem[];
  toast: (msg: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
  sosMode: boolean;
  setSosMode: (v: boolean | ((prev: boolean) => boolean)) => void;
  triggerRefresh: () => void;
  refreshKey: number;
  // Clinical Safeguard preferences
  autoArchive: boolean;
  setAutoArchive: (v: boolean | ((prev: boolean) => boolean)) => void;
  prioritySafeguard: boolean;
  setPrioritySafeguard: (v: boolean | ((prev: boolean) => boolean)) => void;
  retentionPeriod: '6 Months' | '1 Year' | 'Indefinitely';
  setRetentionPeriod: (v: '6 Months' | '1 Year' | 'Indefinitely') => void;
  riskModalOpen: boolean;
  setRiskModalOpen: (v: boolean) => void;
  riskActionCallback: (() => void) | null;
  setRiskActionCallback: (cb: (() => void) | null) => void;
  openRiskModal: (callback: () => void) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tab, setTab] = useState<TabId>('dash');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('all');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [sosMode, setSosMode] = useState<boolean>(false);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // Safeguard states
  const [autoArchive, setAutoArchive] = useState<boolean>(true);
  const [prioritySafeguard, setPrioritySafeguard] = useState<boolean>(true);
  const [retentionPeriod, setRetentionPeriod] = useState<'6 Months' | '1 Year' | 'Indefinitely'>('Indefinitely');
  const [riskModalOpen, setRiskModalOpen] = useState<boolean>(false);
  const [riskActionCallback, setRiskActionCallback] = useState<(() => void) | null>(null);

  const openRiskModal = useCallback((callback: () => void) => {
    setRiskActionCallback(() => callback);
    setRiskModalOpen(true);
  }, []);

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
    }, 4500);
  }, []);

  return (
    <AppContext.Provider
      value={{
        tab,
        setTab,
        selectedMemberId,
        setSelectedMemberId,
        toasts,
        toast,
        removeToast,
        sosMode,
        setSosMode,
        triggerRefresh,
        refreshKey,
        autoArchive,
        setAutoArchive,
        prioritySafeguard,
        setPrioritySafeguard,
        retentionPeriod,
        setRetentionPeriod,
        riskModalOpen,
        setRiskModalOpen,
        riskActionCallback,
        setRiskActionCallback,
        openRiskModal
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
