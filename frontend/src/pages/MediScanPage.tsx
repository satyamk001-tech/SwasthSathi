import React, { useState, useEffect, useRef } from 'react';
import { Member, DrugInteraction, AIDrugAnalysis } from '../types';
import { C } from '../data/seedData';
import { checkDrugs } from '../data/drugKnowledgeBase';
import { idb } from '../lib/idb';
import { analyzeDrugInteractionsAI } from '../lib/aiService';
import { uid } from '../lib/utils';
import { useApp } from '../context/AppContext';
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { Btn } from '../components/common/Button';
import { Chip } from '../components/common/Chip';
import { Spin } from '../components/common/Spinner';
import { InteractionCard } from '../components/mediscan/InteractionCard';

interface DrugItem {
  id: string;
  name: string;
  category?: string;
}

export const MediScanPage: React.FC = () => {
  const { toast } = useApp();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');

  // Medication list
  const [drugs, setDrugs] = useState<DrugItem[]>([
    { id: 'd1', name: 'Warfarin 5mg', category: 'Blood Thinner / Anticoagulant' },
    { id: 'd2', name: 'Ibuprofen 400mg', category: 'NSAID / Pain Reliever' },
    { id: 'd3', name: 'Lisinopril 10mg', category: 'ACE Inhibitor / Blood Pressure' }
  ]);
  const [inputDrug, setInputDrug] = useState('');

  // Checking states
  const [localResults, setLocalResults] = useState<DrugInteraction[] | null>(null);
  const [aiResult, setAiResult] = useState<AIDrugAnalysis | null>(null);
  const [isScanningLabel, setIsScanningLabel] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    const m = await idb.all<Member>('members');
    setMembers(m);
    if (m.length > 0 && !selectedMemberId) {
      setSelectedMemberId(m[0].id);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddDrug = () => {
    if (!inputDrug.trim()) return;
    setDrugs((prev) => [...prev, { id: uid(), name: inputDrug.trim() }]);
    setInputDrug('');
    setLocalResults(null);
    setAiResult(null);
  };

  const handleRemoveDrug = (id: string) => {
    setDrugs((prev) => prev.filter((d) => d.id !== id));
    setLocalResults(null);
    setAiResult(null);
  };

  const handleQuickCheck = () => {
    if (drugs.length < 2) {
      toast('Please add at least 2 medications to check interactions', 'warn');
      return;
    }
    const results = checkDrugs(drugs.map((d) => d.name));
    setLocalResults(results);
    if (results.length > 0) {
      toast(`⚠️ Detected ${results.length} drug interaction(s)!`, 'err');
    } else {
      toast('✅ No known interactions in local database!', 'ok');
    }
  };

  const handleDeepAICheck = async () => {
    if (drugs.length < 2) {
      toast('Please add at least 2 medications to check interactions', 'warn');
      return;
    }
    setIsAiLoading(true);
    try {
      const result = await analyzeDrugInteractionsAI(drugs.map((d) => d.name));
      setAiResult(result);
      await idb.put('drug_logs', {
        id: uid(),
        memberId: selectedMemberId,
        drugs: drugs.map((d) => d.name),
        result
      });
      toast('AI Pharmacological analysis complete!');
    } catch (err: any) {
      toast(err.message || 'Deep check failed', 'err');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleScanMedicineLabel = (file: File) => {
    if (!file) return;
    setIsScanningLabel(true);
    toast('Scanning medicine package label...');

    // Simulate smart OCR detection of package label
    setTimeout(() => {
      const fileNameLower = file.name.toLowerCase();
      let extracted = 'Paracetamol 650mg';
      let category = 'Analgesic / Antipyretic';

      if (fileNameLower.includes('statin') || fileNameLower.includes('atorva')) {
        extracted = 'Atorvastatin 20mg';
        category = 'HMG-CoA Reductase Inhibitor / Statin';
      } else if (fileNameLower.includes('amlo') || fileNameLower.includes('bp')) {
        extracted = 'Amlodipine 5mg';
        category = 'Calcium Channel Blocker';
      } else if (fileNameLower.includes('metformin') || fileNameLower.includes('sugar')) {
        extracted = 'Metformin 500mg SR';
        category = 'Biguanide Anti-diabetic';
      }

      setDrugs((prev) => [...prev, { id: uid(), name: extracted, category }]);
      setIsScanningLabel(false);
      toast(`✅ Scanned & recognized: ${extracted}`);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }, 1200);
  };

  const riskColors: Record<string, string> = {
    Safe: C.green,
    'Low Risk': C.teal,
    'Moderate Risk': C.orange,
    'High Risk': C.red,
    Critical: '#4C0519'
  };

  return (
    <div>
      <Header title="MediScan" subtitle="Clinical Drug Interaction & Safety Checker" />

      {/* Member Selector */}
      {members.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {members.map((m) => {
            const isSelected = selectedMemberId === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setSelectedMemberId(m.id)}
                style={{
                  padding: '5px 12px',
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
      )}

      {/* Current Drug List */}
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
        Current Drug Regimen ({drugs.length})
      </div>

      {drugs.map((d) => (
        <Card
          key={d.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '10px 14px',
            marginBottom: 6
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: C.lBlue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0
            }}
          >
            💊
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: C.text }}>{d.name}</div>
            {d.category && (
              <div style={{ fontSize: 11, color: C.muted, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {d.category}
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => handleRemoveDrug(d.id)}
            style={{
              background: C.lRed,
              border: 'none',
              borderRadius: 8,
              width: 28,
              height: 28,
              cursor: 'pointer',
              color: C.red,
              fontWeight: 900,
              fontSize: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </Card>
      ))}

      {/* Add Medicine input */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 8, marginBottom: 8 }}>
        <input
          value={inputDrug}
          onChange={(e) => setInputDrug(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddDrug()}
          placeholder="Type drug name (e.g. Aspirin 75mg, Metformin)..."
          style={{
            padding: '9px 12px',
            borderRadius: 9,
            border: `1.5px solid ${C.border}`,
            fontSize: 13,
            outline: 'none',
            fontFamily: 'inherit',
            background: '#fff'
          }}
        />
        <Btn bg={C.blue} onClick={handleAddDrug}>
          + Add
        </Btn>
      </div>

      {/* Hidden File Input for scanning pill box */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/webp"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleScanMedicineLabel(file);
        }}
      />

      <Btn
        full
        bg={C.navy}
        style={{ marginBottom: 12 }}
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
            fileInputRef.current.click();
          }
        }}
        disabled={isScanningLabel}
      >
        {isScanningLabel ? <Spin size={5} color="#fff" /> : '📷 Scan Medicine Strip / Box'}
      </Btn>

      {/* Action check buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
        <Btn full bg={C.purple} disabled={drugs.length < 2} onClick={handleQuickCheck}>
          🧠 Quick KB Check
        </Btn>
        <Btn full bg={C.navy} disabled={drugs.length < 2 || isAiLoading} onClick={handleDeepAICheck}>
          {isAiLoading ? <Spin size={5} color="#fff" /> : '✨ AI Deep Check'}
        </Btn>
      </div>

      {/* Local DB Results */}
      {localResults !== null && (
        <div style={{ marginBottom: 12 }}>
          <h2 style={{ fontWeight: 800, fontSize: 14, color: C.navy, marginBottom: 8 }}>
            Knowledge Base Results
          </h2>

          {localResults.length === 0 ? (
            <Card
              style={{
                background: C.lGreen,
                borderLeft: `4px solid ${C.green}`,
                textAlign: 'center',
                padding: 16
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 4 }}>✅</div>
              <div style={{ fontWeight: 700, color: C.green }}>No interactions found locally</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>
                Run AI Deep Check for complete pharmacological analysis
              </div>
            </Card>
          ) : (
            localResults.map((ix, i) => (
              <InteractionCard
                key={i}
                sev={ix.sev}
                drugs={ix.drugs}
                why={ix.why}
                alternatives={ix.alt}
              />
            ))
          )}
        </div>
      )}

      {/* AI Deep Analysis Output */}
      {aiResult && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h2 style={{ fontWeight: 800, fontSize: 14, color: C.navy, margin: 0 }}>
              AI Clinical Pharmacologist Report
            </h2>
            <Chip
              label={aiResult.overallRisk}
              color={riskColors[aiResult.overallRisk] || C.muted}
            />
          </div>

          {aiResult.summary && (
            <Card style={{ background: C.lBlue, marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 13, color: C.text }}>{aiResult.summary}</p>
            </Card>
          )}

          {aiResult.interactions?.map((ix, i) => (
            <InteractionCard
              key={i}
              sev={ix.sev}
              drugs={ix.drugs}
              mechanism={ix.mechanism}
              management={ix.management}
              alternatives={ix.alternatives}
            />
          ))}

          {aiResult.recommendations && aiResult.recommendations.length > 0 && (
            <Card style={{ background: C.lGreen }}>
              <div style={{ fontWeight: 700, color: C.green, marginBottom: 5 }}>
                📋 Safe Clinical Recommendations
              </div>
              {aiResult.recommendations.map((r, i) => (
                <div key={i} style={{ fontSize: 12, color: C.text, marginBottom: 3 }}>
                  • {r}
                </div>
              ))}
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
