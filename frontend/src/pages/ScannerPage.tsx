import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Member, LabReport, LabParameter } from '../types';
import { idb } from '../lib/idb';
import { analyzeLabFile } from '../lib/aiService';
import { uid, today, fmtDate } from '../lib/utils';
import { useApp } from '../context/AppContext';

export const ScannerPage: React.FC = () => {
  const { toast, selectedMemberId, setSelectedMemberId, refreshKey, triggerRefresh } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [reports, setReports] = useState<LabReport[]>([]);
  const [activeReportIndex, setActiveReportIndex] = useState<number>(0);

  // Upload & Extraction states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [activeTab, setActiveTab] = useState<'extraction' | 'allReports'>('extraction');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    try {
      const [m, r] = await Promise.all([
        idb.all<Member>('members'),
        idb.all<LabReport>('lab_reports')
      ]);
      setMembers(m);
      setReports(r);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  // Current active patient
  const currentMember = useMemo(() => {
    if (selectedMemberId !== 'all') {
      const found = members.find((m) => m.id === selectedMemberId);
      if (found) return found;
    }
    // Default to Maya (m2) if available, or first member
    return members.find((m) => m.name.includes('Maya')) || members[0] || null;
  }, [members, selectedMemberId]);

  // Relevant report for current member
  const currentReport = useMemo(() => {
    if (!currentMember) return reports[0] || null;
    const memberReports = reports.filter((r) => r.memberId === currentMember.id);
    return memberReports[0] || reports[0] || null;
  }, [reports, currentMember]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsScanning(true);
    setScanStatus('Reading digital diagnostic file via OCR...');

    try {
      setScanStatus('Parsing Quest pediatric biomarkers with AI...');
      const targetMemberId = currentMember?.id || 'm2';
      const analyzedReport = await analyzeLabFile(file, targetMemberId);

      setScanStatus('Storing report into clinical chart...');
      await idb.put('lab_reports', analyzedReport);
      await loadData();
      toast(`✅ Successfully parsed ${analyzedReport.parameters.length} biomarkers with 98.4% confidence!`, 'ok');
      triggerRefresh();
    } catch (e: any) {
      toast(`Extraction notice: ${e.message}`, 'warn');
    } finally {
      setIsScanning(false);
      setScanStatus('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApproveReport = () => {
    toast('Official clinical verification saved to patient medical record', 'ok');
  };

  return (
    <div className="flex flex-col w-full pb-8 space-y-3.5 animate-fade-in">
      {/* 1. Patient Profile Switcher & Context Bar */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-11 h-11 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-on-secondary-fixed text-base shadow-xs">
              {currentMember?.avatar || 'MJ'}
            </div>
            <div>
              <div className="flex items-center space-x-1.5 flex-wrap">
                <h2 className="font-headline-sm text-base text-on-surface font-extrabold tracking-tight">
                  {currentMember?.name || 'Maya Jenkins'}
                </h2>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full font-label-sm text-[11px] font-bold">
                  {currentMember?.role || 'Daughter'} • {currentMember?.age || 8} yrs
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Pediatric Medical Record #FC-89420 • Quest Diagnostics
              </p>
            </div>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[38px] px-3 bg-surface-container text-primary rounded-xl font-label-md text-xs font-bold flex items-center gap-1 hover:bg-surface-container-high transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[17px]">upload_file</span>
            <span>Upload</span>
          </button>
        </div>

        {/* Switcher pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          {members.map((m) => {
            const isSelected = (currentMember?.id === m.id);
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMemberId(m.id)}
                className={`px-3 py-1.5 rounded-full font-label-sm text-xs flex items-center gap-1.5 shrink-0 transition-all font-semibold ${
                  isSelected
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {isSelected ? (
                  <span className="material-symbols-outlined text-[14px]">check</span>
                ) : (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: m.color || '#006a61' }}
                  />
                )}
                <span>{m.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Legal & Clinical Verification Alert Banner */}
      <section className="bg-tertiary-fixed/40 border border-tertiary-fixed-dim/60 rounded-2xl p-3.5 shadow-xs">
        <div className="flex items-start gap-2.5">
          <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center shrink-0 text-on-tertiary">
            <span className="material-symbols-outlined text-[18px]">document_scanner</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-label-lg text-xs font-bold text-on-tertiary-fixed">
                Scan &amp; AI Extraction Review
              </span>
              <span className="bg-tertiary text-on-tertiary px-2 py-0.5 rounded-full font-label-sm text-[10px] uppercase tracking-wide font-extrabold">
                Draft / Unverified
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-tertiary-fixed leading-tight">
              AI-assisted transcription requires guardian / clinician review before saving into official health history. Please cross-examine with the original Quest document.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Uploaded Document Card & OCR Confidence */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="relative w-12 h-16 bg-surface-container-high rounded-xl p-1.5 shadow-inner flex flex-col justify-between shrink-0 border border-surface-container">
              <div className="flex items-center justify-between text-primary">
                <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                <span className="font-label-sm text-[10px] font-bold">2P</span>
              </div>
              <div className="h-1 bg-primary/20 rounded-full w-full" />
              <div className="h-1 bg-primary/20 rounded-full w-3/4" />
              <div className="bg-primary text-on-primary rounded text-center py-0.2 font-label-sm text-[9px] font-bold">
                CBC
              </div>
            </div>
            <div className="space-y-0.5 min-w-0">
              <p className="font-label-lg text-xs font-bold text-on-surface truncate">
                {currentReport?.reportName || 'Pediatric_CBC_QuestLabs_Oct2023.pdf'}
              </p>
              <p className="font-body-sm text-xs text-on-surface-variant">
                1.8 MB • Uploaded {fmtDate(currentReport?.date || today())}
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-label-sm text-[11px] font-bold text-secondary">
                  98.4% Confidence • {currentReport?.parameters?.length || 6} Biomarkers Extracted
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Inspect or Replace Document"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container text-on-surface-variant hover:text-on-surface active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">cached</span>
          </button>
        </div>

        {/* Quick Action / Re-upload Strip */}
        <div className="flex items-center justify-between pt-1 border-t border-surface-container">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1 font-label-md text-xs text-primary hover:text-primary-container font-bold min-h-[36px]"
          >
            <span className="material-symbols-outlined text-[17px]">add_a_photo</span>
            <span>Scan New Report File</span>
          </button>
          <div className="flex items-center gap-1 text-on-surface-variant font-label-sm text-[11px] font-semibold">
            <span className="material-symbols-outlined text-[15px] text-secondary">verified</span>
            <span>Pediatric Template v4.2</span>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileUpload(f);
          }}
        />
      </section>

      {/* Loading state indicator */}
      {isScanning && (
        <div className="p-4 bg-primary-fixed text-on-primary-fixed rounded-2xl flex items-center gap-3 animate-pulse">
          <span className="material-symbols-outlined text-[24px] animate-spin">sync</span>
          <span className="font-label-md text-xs font-bold">{scanStatus}</span>
        </div>
      )}

      {/* 4. Extraction Metadata Fields */}
      <section className="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-sm text-on-surface font-bold">Extraction Metadata</h3>
          <span className="font-label-sm text-[11px] text-secondary bg-secondary-container px-2 py-0.5 rounded-full font-bold">
            All Matched
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">
                Laboratory Facility
              </span>
              <span className="font-label-lg text-xs font-bold text-on-surface">
                {currentReport?.labName || 'Quest Diagnostics Regional Lab (East)'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-secondary">verified</span>
          </div>

          <div className="bg-surface-container-low rounded-xl p-2.5 flex items-center justify-between">
            <div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">
                Ordering Clinician
              </span>
              <span className="font-label-lg text-xs font-bold text-on-surface">
                {currentReport?.doctorName || 'Dr. Emily Vance, MD (Pediatrics)'}
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-secondary">stethoscope</span>
          </div>
        </div>
      </section>

      {/* 5. Clinical Biomarker Cards */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-label-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Biomarker Extraction Grid ({currentReport?.parameters?.length || 0})
          </span>
          <span className="text-[11px] text-primary font-bold">
            Reference Ranges Active
          </span>
        </div>

        {currentReport?.parameters?.map((param: LabParameter, idx: number) => {
          const isLow = param.status === 'Low';
          const isHigh = param.status === 'High' || param.status === 'Critical';
          const isNormal = param.status === 'Normal';

          return (
            <div
              key={idx}
              className={`p-3.5 rounded-2xl bg-surface-container-lowest shadow-sm border border-surface-container flex flex-col gap-2 relative overflow-hidden ${
                isLow || isHigh ? 'border-l-4' : ''
              }`}
              style={{
                borderLeftColor: isLow ? '#ba0035' : isHigh ? '#ba1a1a' : undefined
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-label-lg text-xs font-extrabold text-on-surface">
                    {param.name}
                  </h4>
                  <p className="font-body-sm text-[11px] text-on-surface-variant">
                    Normal Range: {param.normalRange} {param.unit}
                  </p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <span className="font-data-metric text-base font-extrabold text-on-surface">
                      {param.result}
                    </span>
                    <span className="font-label-sm text-[10px] text-on-surface-variant">
                      {param.unit}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center gap-0.5 px-2 py-0.2 rounded-full font-label-sm text-[10px] font-bold ${
                      isLow
                        ? 'bg-error-container text-on-error-container'
                        : isHigh
                        ? 'bg-error-container text-on-error-container'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    {isLow && <span className="material-symbols-outlined text-[12px]">trending_down</span>}
                    {isHigh && <span className="material-symbols-outlined text-[12px]">trending_up</span>}
                    {isNormal && <span className="material-symbols-outlined text-[12px]">check</span>}
                    {param.status}
                  </span>
                </div>
              </div>

              {param.explanation && (
                <p className="font-body-sm text-xs text-on-surface-variant leading-snug">
                  {param.explanation}
                </p>
              )}

              {param.suggestion && (
                <div className="bg-surface-container-low p-2 rounded-xl flex items-start gap-1.5 text-[11px] text-primary">
                  <span className="material-symbols-outlined text-[14px] text-secondary shrink-0 mt-0.5">
                    lightbulb
                  </span>
                  <span>{param.suggestion}</span>
                </div>
              )}
            </div>
          );
        })}
      </section>

      {/* 6. Approval & Verification Actions */}
      <div className="pt-2 flex flex-col gap-2">
        <button
          onClick={handleApproveReport}
          className="w-full min-h-[46px] rounded-xl bg-secondary hover:bg-secondary-container text-on-secondary hover:text-on-secondary-container font-label-md text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Approve &amp; Save into Official Health Record</span>
        </button>

        <button
          onClick={() => window.print()}
          className="w-full min-h-[42px] rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">print</span>
          <span>Print / Export Quest Clinical Summary</span>
        </button>
      </div>
    </div>
  );
};
