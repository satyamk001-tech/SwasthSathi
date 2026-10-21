import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

interface RiskAcknowledgmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const RiskAcknowledgmentModal: React.FC<RiskAcknowledgmentModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const { toast } = useApp();
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    const duration = 12000; // 12 seconds auto-dismiss
    const interval = 100;
    const step = (interval / duration) * 100;

    timerRef.current = window.setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= step) {
            clearInterval(timerRef.current!);
            onClose();
            return 0;
          }
          return prev - step;
        });
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused, onClose]);

  if (!isOpen) return null;

  const handleConfirmRisk = () => {
    onConfirm();
    onClose();
    toast('Safety safeguard bypassed by user confirmation', 'warn');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-inverse-surface/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-error-container overflow-hidden flex flex-col relative animate-slide-up"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Top Progress Timer Bar */}
        <div className="w-full h-1.5 bg-surface-container">
          <div
            className="h-full bg-tertiary transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Header alert icon & title */}
        <div className="p-5 pb-3 flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-full bg-error-container text-on-error-container flex items-center justify-center shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[24px]">crisis_alert</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                Clinical Safety Confirmation
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container font-label-sm text-[10px] font-extrabold uppercase">
                High Risk
              </span>
            </div>
            <p className="font-body-sm text-xs text-on-surface-variant mt-0.5">
              Permanently disabling safeguard protection
            </p>
          </div>
        </div>

        {/* Warning Callout Box */}
        <div className="px-5 py-3">
          <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">warning</span>
              <span>Potential Data Loss Advisory</span>
            </div>
            <p className="font-body-sm text-xs text-amber-950 leading-relaxed">
              Disabling auto-archive will permanently delete any dismissed doctor inquiries, medication alerts, or lab-flagged markers. Dr. Vance will not be able to cross-reference past questions.
            </p>
            <ul className="text-[11.5px] text-amber-900 space-y-1 pl-4 list-disc font-medium">
              <li>Maya's pediatric iron deficiency history will lose clinical context.</li>
              <li>Dismissed items cannot be recovered from the archive.</li>
              <li>Compliance records will not retain doctor verification notes.</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 pt-2 flex flex-col gap-2">
          <button
            onClick={handleConfirmRisk}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-tertiary hover:bg-tertiary-container text-on-tertiary font-label-md text-sm font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">delete_forever</span>
            <span>I Understand the Clinical Risk</span>
          </button>

          <button
            onClick={onClose}
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-sm font-semibold flex items-center justify-center gap-1.5 active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">verified</span>
            <span>Keep Safeguard Active (Recommended)</span>
          </button>
        </div>

        {/* Hover hint */}
        <div className="px-5 pb-3 text-center">
          <span className="text-[10px] text-outline">
            {isPaused ? '⏸ Timer paused on hover' : 'Auto-cancels in 12 seconds for safety'}
          </span>
        </div>
      </div>
    </div>
  );
};
