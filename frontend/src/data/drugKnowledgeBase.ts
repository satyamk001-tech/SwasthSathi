import { DrugInteraction } from '../types';

export const DRUG_KB: DrugInteraction[] = [
  {
    drugs: ['warfarin', 'ibuprofen'],
    sev: 'Major',
    why: 'Both impair blood clotting — severe internal bleeding and gastrointestinal hemorrhage risk',
    alt: ['Paracetamol', 'Celecoxib (with monitoring)']
  },
  {
    drugs: ['warfarin', 'aspirin'],
    sev: 'Major',
    why: 'Dual anticoagulation and antiplatelet effect — uncontrolled bleeding risk',
    alt: ['Low-dose aspirin only if cardiologist-prescribed with INR monitoring']
  },
  {
    drugs: ['metformin', 'alcohol'],
    sev: 'Major',
    why: 'Lactic acidosis risk — potentially fatal buildup of lactic acid in bloodstream',
    alt: ['Avoid alcohol completely while on Metformin therapy']
  },
  {
    drugs: ['ssri', 'tramadol'],
    sev: 'Major',
    why: 'Serotonin syndrome risk — hyperthermia, seizures, and neurological emergency',
    alt: ['Paracetamol', 'Topical analgesics', 'Non-serotonergic pain management']
  },
  {
    drugs: ['amlodipine', 'simvastatin'],
    sev: 'Moderate',
    why: 'Amlodipine increases Simvastatin concentration, elevating muscle damage (rhabdomyolysis) risk',
    alt: ['Rosuvastatin', 'Atorvastatin (max 20mg)', 'Pravastatin']
  },
  {
    drugs: ['lisinopril', 'potassium'],
    sev: 'Moderate',
    why: 'Hyperkalemia — ACE inhibitors reduce potassium excretion, risking cardiac arrhythmia',
    alt: ['Avoid potassium supplements without nephrologist approval', 'Monitor serum K+']
  },
  {
    drugs: ['ciprofloxacin', 'antacid'],
    sev: 'Moderate',
    why: 'Magnesium and aluminum antacids chelate with fluoroquinolones, preventing absorption',
    alt: ['Take antacids at least 2 hours before or 4 hours after antibiotics']
  },
  {
    drugs: ['clopidogrel', 'omeprazole'],
    sev: 'Moderate',
    why: 'Omeprazole inhibits CYP2C19, significantly reducing Clopidogrel antiplatelet efficacy',
    alt: ['Pantoprazole', 'Famotidine']
  }
];

export function checkDrugs(list: string[]): DrugInteraction[] {
  const normalized = list.map(d => d.toLowerCase());
  return DRUG_KB.filter(entry => {
    const matches = entry.drugs.filter(drug =>
      normalized.some(m => m.includes(drug) || drug.includes(m))
    );
    return matches.length >= 2;
  });
}
