import React, { useState, useEffect, useRef } from 'react';
import { Member, LabReport } from '../types';
import { C } from '../data/seedData';
import { idb } from '../lib/idb';
import { analyzeLabFile } from '../lib/aiService';
import { fmtDate } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Btn } from '../components/common/Button';
import { Chip } from '../components/common/Chip';
import { Spin } from '../components/common/Spinner';
import { ParameterCard } from '../components/scanner/ParameterCard';
import { ReportViewerModal } from '../components/scanner/ReportViewerModal';

export const ScannerPage: React.FC = () => {
  const { toast } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [reports, setReports] = useState<LabReport[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'scan' | 'history'>('scan');

  // Drag & Scanning state
  const [isDragging, setIsDragging] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [currentResult, setCurrentResult] = useState<LabReport | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [viewingReport, setViewingReport] = useState<LabReport | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    const [m, r] = await Promise.all([
      idb.all<Member>('members'),
      idb.all<LabReport>('lab_reports')
    ]);
    setMembers(m);
    setReports(r.sort((a, b) => (b._ts || 0) - (a._ts || 0)));
    if (m.length > 0 && !selectedMemberId) {
      setSelectedMemberId(m[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleProcessFile = async (file: File) => {
    if (!file) return;
    setErrorMsg('');
    setCurrentResult(null);
    setPreviewImage(null);
    setIsScanning(true);
    setScanStatus('Reading digital diagnostic file...');

    try {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file);
      }

      setScanStatus('Analyzing biomarker ranges with AI...');
      const analyzedReport = await analyzeLabFile(file, selectedMemberId);

      setScanStatus('Storing report into secure health journal...');
      await idb.put('lab_reports', analyzedReport);

      setCurrentResult(analyzedReport);
      await loadData();
      toast(`✅ Successfully parsed ${analyzedReport.parameters.length} parameters!`);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to extract lab parameters');
      toast(err.message || 'Report scan error', 'err');
    } finally {
      setIsScanning(false);
      setScanStatus('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePrintReport = (report: LabReport) => {
    const mem = members.find((m) => m.id === report.memberId);
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast('Pop-up blocked. Please allow pop-ups to print.', 'warn');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${report.reportName} - SwasthSathi</title>
        <style>
          body { font-family: 'Sora', Arial, sans-serif; padding: 24px; color: #1E293B; background: #fff; }
          h2 { color: #0B1E3D; margin-bottom: 4px; }
          .meta { color: #64748B; font-size: 13px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #DDE3ED; padding: 10px 12px; text-align: left; font-size: 13px; }
          th { background: #EEF2F7; font-weight: 700; color: #0B1E3D; }
          .normal { color: #057A55; font-weight: 700; }
          .low { color: #D97706; font-weight: 700; }
          .high, .critical { color: #D42B2B; font-weight: 700; }
          .footer { margin-top: 30px; font-size: 11px; color: #94A3B8; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h2>🏥 ${report.reportName}</h2>
        <div class="meta">
          <strong>Patient:</strong> ${mem?.name || 'Self'} | 
          <strong>Date:</strong> ${report.date} | 
          <strong>Laboratory:</strong> ${report.labName || 'Diagnostic Center'}
        </div>
        <table>
          <thead>
            <tr>
              <th>Biomarker</th>
              <th>Result</th>
              <th>Unit</th>
              <th>Normal Target</th>
              <th>Status</th>
              <th>Clinical Recommendation</th>
            </tr>
          </thead>
          <tbody>
            ${report.parameters
              .map(
                (p) => `
              <tr>
                <td><strong>${p.name}</strong></td>
                <td class="${p.status.toLowerCase()}">${p.result}</td>
                <td>${p.unit}</td>
                <td>${p.normalRange}</td>
                <td class="${p.status.toLowerCase()}">${p.status}</td>
                <td>${p.suggestion || p.explanation || '—'}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
        <div class="footer">
          Generated securely via SwasthSathi Family Health Assistant · Consult a registered doctor for clinical verification.
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 300);
  };

  const handleShareReport = (report: LabReport) => {
    const mem = members.find((m) => m.id === report.memberId);
    const summary = `🏥 SwasthSathi Report: ${report.reportName}\nPatient: ${mem?.name || 'Self'}\nDate: ${report.date}\n\n${report.parameters
      .map((p) => `• ${p.name}: ${p.result} ${p.unit} [${p.status}]`)
      .join('\n')}`;

    if (navigator.share) {
      navigator.share({ title: report.reportName, text: summary }).catch(() => {});
    } else {
      navigator.clipboard.writeText(summary);
      toast('Report copied to clipboard!');
    }
  };

  const handleDeleteReport = async (id: string) => {
    await idb.del('lab_reports', id);
    if (currentResult?.id === id) setCurrentResult(null);
    await loadData();
    toast('Report deleted', 'warn');
  };

  return (
    <div>
      <Header title="Lab Scanner" subtitle="AI Biomarker Extraction & Analysis" />

      {/* Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 4,
          background: C.border,
          borderRadius: 10,
          padding: 3,
          marginBottom: 14
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('scan')}
          style={{
            padding: 8,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 12,
            background: activeTab === 'scan' ? C.card : 'transparent',
            color: activeTab === 'scan' ? C.navy : C.muted
          }}
        >
          🔬 Scan Report
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          style={{
            padding: 8,
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontWeight: 700,
            fontSize: 12,
            background: activeTab === 'history' ? C.card : 'transparent',
            color: activeTab === 'history' ? C.navy : C.muted
          }}
        >
          📁 Saved History ({reports.length})
        </button>
      </div>

      {activeTab === 'scan' && (
        <>
          {/* Member assignment selector */}
          {members.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.muted,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  marginBottom: 6
                }}
              >
                Assign Report To
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {members.map((m) => {
                  const isSelected = selectedMemberId === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setSelectedMemberId(m.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 20,
                        border: `2px solid ${isSelected ? m.color : C.border}`,
                        background: isSelected ? `${m.color}18` : '#ffffff',
                        color: isSelected ? m.color : C.text,
                        fontWeight: 700,
                        fontSize: 12,
                        cursor: 'pointer'
                      }}
                    >
                      {m.avatar} {m.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp,image/heic,application/pdf"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleProcessFile(file);
            }}
          />

          {/* Upload Dropzone */}
          <div
            onClick={() => {
              if (!isScanning && fileInputRef.current) {
                fileInputRef.current.value = '';
                fileInputRef.current.click();
              }
            }}
            onDragOver={(e) => {
              e.preventDefault();
              if (!isScanning) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file && !isScanning) handleProcessFile(file);
            }}
            style={{
              background: isScanning ? '#F0F7FF' : isDragging ? C.lBlue : '#FAFBFC',
              border: `2px dashed ${isScanning ? C.blue : isDragging ? C.blue : C.border}`,
              borderRadius: 14,
              textAlign: 'center',
              padding: '32px 16px',
              cursor: isScanning ? 'default' : 'pointer',
              marginBottom: 10,
              transition: 'all 0.2s ease',
              minHeight: 160,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10
            }}
          >
            {isScanning ? (
              <>
                <Spin size={10} color={C.blue} />
                <div style={{ fontWeight: 700, color: C.blue, fontSize: 14 }}>
                  {scanStatus}
                </div>
                <div style={{ fontSize: 11, color: C.muted }}>Processing medical report...</div>
              </>
            ) : currentResult && previewImage ? (
              <>
                <img
                  src={previewImage}
                  alt="preview"
                  style={{ maxHeight: 90, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }}
                />
                <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>
                  ✅ Tap to scan another lab sheet
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48 }}>🔬</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: C.navy }}>
                  Drop Diagnostic Lab Report Here
                </div>
                <div style={{ fontSize: 13, color: C.muted }}>or tap anywhere to upload file</div>
                <div
                  style={{
                    fontSize: 11,
                    color: C.muted,
                    background: C.lBlue,
                    borderRadius: 8,
                    padding: '4px 12px'
                  }}
                >
                  JPG · PNG · PDF · HEIC
                </div>
              </>
            )}
          </div>

          {/* Trigger Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
            <Btn
              full
              bg={C.navy}
              disabled={isScanning}
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                  fileInputRef.current.click();
                }
              }}
            >
              📷 Upload Image
            </Btn>
            <Btn
              full
              outline
              color={C.navy}
              disabled={isScanning}
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                  fileInputRef.current.click();
                }
              }}
            >
              📄 Upload PDF
            </Btn>
          </div>

          {/* Error Message */}
          {errorMsg && !isScanning && (
            <Card style={{ background: C.lRed, borderLeft: `4px solid ${C.red}`, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: C.red, marginBottom: 5 }}>⚠️ Analysis Notice</div>
              <div style={{ fontSize: 12, color: C.text, marginBottom: 6 }}>{errorMsg}</div>
              <div style={{ fontSize: 11, color: C.muted }}>
                Tip: Ensure good lighting, lay the paper flat, and capture all columns clearly.
              </div>
            </Card>
          )}

          {/* Scanned Result Parameters */}
          {currentResult && !isScanning && (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 8
                }}
              >
                <h2 style={{ fontWeight: 900, fontSize: 16, color: C.navy, margin: 0 }}>
                  ✅ {currentResult.parameters.length} Biomarkers Extracted
                </h2>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Btn small bg={C.teal} onClick={() => handleShareReport(currentResult)}>
                    📤
                  </Btn>
                  <Btn small bg={C.navy} onClick={() => handlePrintReport(currentResult)}>
                    🖨
                  </Btn>
                  <Btn small outline color={C.red} onClick={() => handleDeleteReport(currentResult.id)}>
                    🗑
                  </Btn>
                </div>
              </div>

              <Card style={{ background: C.lBlue, marginBottom: 10 }}>
                <div style={{ fontWeight: 700, color: C.navy }}>📄 {currentResult.reportName}</div>
                <div style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>
                  {currentResult.date}
                  {currentResult.labName ? ` · ${currentResult.labName}` : ''}
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <Chip
                    label={`${currentResult.parameters.filter((p) => p.status === 'Normal').length} Normal`}
                    color={C.green}
                  />
                  {currentResult.parameters.filter((p) => p.status !== 'Normal').length > 0 && (
                    <Chip
                      label={`${currentResult.parameters.filter((p) => p.status !== 'Normal').length} Out of Range`}
                      color={C.red}
                    />
                  )}
                </div>
              </Card>

              {currentResult.parameters.map((p, idx) => (
                <ParameterCard key={idx} param={p} />
              ))}
            </>
          )}

          {/* Fast access to existing member reports */}
          {!currentResult && !isScanning && reports.filter((r) => r.memberId === selectedMemberId).length > 0 && (
            <>
              <div style={{ fontWeight: 700, color: C.navy, marginBottom: 8, marginTop: 8 }}>
                📋 Existing Reports for this Member
              </div>
              {reports
                .filter((r) => r.memberId === selectedMemberId)
                .slice(0, 2)
                .map((r) => (
                  <Card
                    key={r.id}
                    style={{ cursor: 'pointer', background: C.lBlue }}
                    onClick={() => setCurrentResult(r)}
                  >
                    <div style={{ fontWeight: 700, color: C.navy }}>📄 {r.reportName}</div>
                    <div style={{ fontSize: 11, color: C.muted }}>
                      {fmtDate(r.date)} · {r.parameters?.length} parameters ·{' '}
                      <span style={{ color: C.blue, fontWeight: 700 }}>Tap to view</span>
                    </div>
                  </Card>
                ))}
            </>
          )}
        </>
      )}

      {activeTab === 'history' && (
        <>
          <h2 style={{ fontWeight: 800, fontSize: 16, color: C.navy, marginBottom: 10 }}>
            All Stored Reports ({reports.length})
          </h2>

          {reports.length === 0 ? (
            <Card>
              <p style={{ color: C.muted, textAlign: 'center', padding: 20 }}>
                No diagnostic reports stored yet. Use the Scan Report tab to upload.
              </p>
            </Card>
          ) : (
            reports.map((r) => {
              const mem = members.find((m) => m.id === r.memberId);
              const abnormalCount = r.parameters?.filter((p) => p.status !== 'Normal').length || 0;
              return (
                <Card
                  key={r.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setViewingReport(r)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>📄 {r.reportName}</div>
                      <div style={{ fontSize: 11, color: C.muted, marginBottom: 5 }}>
                        {fmtDate(r.date)}
                        {mem ? ` · ${mem.name}` : ''}
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        <Chip
                          label={`${r.parameters?.filter((p) => p.status === 'Normal').length || 0} Normal`}
                          color={C.green}
                        />
                        {abnormalCount > 0 && (
                          <Chip label={`${abnormalCount} Abnormal`} color={C.red} />
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 5 }}>
                      <Btn
                        small
                        bg={C.teal}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareReport(r);
                        }}
                      >
                        📤
                      </Btn>
                      <Btn
                        small
                        bg={C.navy}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrintReport(r);
                        }}
                      >
                        🖨
                      </Btn>
                      <Btn
                        small
                        outline
                        color={C.red}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(r.id);
                        }}
                      >
                        🗑
                      </Btn>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </>
      )}

      {/* Modal for viewing detailed report */}
      {viewingReport && (
        <ReportViewerModal
          report={viewingReport}
          members={members}
          onClose={() => setViewingReport(null)}
          onPrint={handlePrintReport}
        />
      )}
    </div>
  );
};
