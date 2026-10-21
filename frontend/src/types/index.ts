export interface Member {
  id: string;
  name: string;
  age: number;
  role: string;
  avatar: string;
  color: string;
  blood?: string;
  phone?: string;
  conditions?: string[];
  _ts?: number;
}

export interface Medication {
  id: string;
  memberId: string;
  name: string;
  dose: string;
  time: string;
  freq: string;
  taken: boolean | 'skipped' | null;
  notes?: string;
  _ts?: number;
}

export interface MedicationLog {
  id: string;
  medId: string;
  memberId: string;
  status: 'taken' | 'skipped';
  at: string;
  _ts?: number;
}

export interface Vital {
  id: string;
  memberId: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  notes?: string;
  _ts?: number;
}

export interface LabParameter {
  name: string;
  result: string;
  unit: string;
  normalRange: string;
  status: 'Normal' | 'Low' | 'High' | 'Critical';
  explanation?: string;
  suggestion?: string;
}

export interface LabReport {
  id: string;
  memberId: string;
  reportName: string;
  date: string;
  labName?: string;
  doctorName?: string;
  parameters: LabParameter[];
  preview?: string | null;
  _ts?: number;
}

export interface Appointment {
  id: string;
  memberId: string;
  doctor: string;
  specialty: string;
  date: string;
  time?: string;
  notes?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  _ts?: number;
}

export interface Hospital {
  id: string;
  name: string;
  dist: number;
  lat: number;
  lng: number;
  tags: string[];
  erBeds: number;
  phone: string;
  rating: number;
  slots: string[];
  quiet: string;
  emoji: string;
}

export interface DrugInteraction {
  drugs: string[];
  sev: 'Major' | 'Moderate' | 'Minor';
  why: string;
  alt: string[];
}

export interface AIDrugAnalysis {
  interactions: Array<{
    sev: 'Major' | 'Moderate' | 'Minor';
    drugs: string[];
    mechanism: string;
    effect: string;
    management: string;
    alternatives: string[];
  }>;
  overallRisk: 'Safe' | 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical';
  summary: string;
  recommendations: string[];
}

export interface MLPrediction {
  label: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  confidence: number;
  top3: Array<{ label: string; pct: number }>;
}

export interface AITriageResult {
  specialty: string;
  urgency: 'emergency' | 'urgent' | 'routine';
  recommendation: string;
  redFlags: string[];
  immediateActions: string[];
}

export interface DietPlan {
  breakfast?: { meal: string; cal?: number; time?: string };
  lunch?: { meal: string; cal?: number; time?: string };
  dinner?: { meal: string; cal?: number; time?: string };
  snack?: { meal: string; cal?: number; time?: string };
  total: number;
  avoid?: string[];
  tip?: string;
}

export interface AppointmentPrep {
  questions: string[];
  tips?: string[];
  bring?: string[];
}

export interface HealthInsight {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
}

export interface HealthAnalyticsAI {
  insights: HealthInsight[];
  overallTrend: 'improving' | 'stable' | 'declining';
  message: string;
}

export interface ChatMessage {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}
