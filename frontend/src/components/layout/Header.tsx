import React from 'react';
import { C } from '../../data/seedData';
import { Btn } from '../common/Button';
import { SOSBtn } from '../common/SOSButton';
import { useApp } from '../../context/AppContext';
import { idb } from '../../lib/idb';
import { today } from '../../lib/utils';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showExport?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, showExport = false }) => {
  const { toast, setTab, setSosMode } = useApp();

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
      a.download = `swasthsathi_health_${today()}.json`;
      a.click();
      toast('Health data exported successfully!');
    } catch (e: any) {
      toast(`Export failed: ${e.message}`, 'err');
    }
  };

  const handleSOS = () => {
    setSosMode(true);
    setTab('sched');
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: C.navy,
            letterSpacing: -0.5,
            margin: 0
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: 11, color: C.muted, marginTop: 2, margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        {showExport && (
          <Btn small outline color={C.navy} onClick={handleExportAll}>
            📤 Export
          </Btn>
        )}
        <SOSBtn onPress={handleSOS} />
      </div>
    </div>
  );
};
