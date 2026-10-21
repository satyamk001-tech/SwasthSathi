import React from 'react';
import { LabReport, Member } from '../../types';
import { C } from '../../data/seedData';
import { Modal } from '../common/Modal';
import { Btn } from '../common/Button';
import { ParameterCard } from './ParameterCard';
import { fmtDate } from '../../lib/utils';
import { useApp } from '../../context/AppContext';

interface ReportViewerModalProps {
  report: LabReport;
  members: Member[];
  onClose: () => void;
  onPrint: (report: LabReport) => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({
  report,
  members,
  onClose,
  onPrint
}) => {
  const { toast } = useApp();
  const mem = members.find((m) => m.id === report.memberId);

  const handleShare = () => {
    const text = `🏥 Lab Report: ${report.reportName}\nPatient: ${mem?.name || 'Self'}\nDate: ${report.date}\n\n${report.parameters
      ?.map((p) => `${p.name}: ${p.result} ${p.unit} [${p.status}]`)
      .join('\n')}`;

    if (navigator.share) {
      navigator.share({ title: report.reportName, text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast('Report summary copied to clipboard!');
    }
  };

  return (
    <Modal title={report.reportName} onClose={onClose}>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 12 }}>
        {fmtDate(report.date)} · Patient: {mem?.name || 'Self'}{' '}
        {report.labName ? `· ${report.labName}` : ''}
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <Btn small bg={C.teal} onClick={handleShare}>
          📤 Share Summary
        </Btn>
        <Btn small bg={C.navy} onClick={() => onPrint(report)}>
          🖨 Print / PDF
        </Btn>
      </div>

      {report.parameters?.map((p, idx) => (
        <ParameterCard key={idx} param={p} />
      ))}
    </Modal>
  );
};
