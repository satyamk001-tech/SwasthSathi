import { Member, Medication, Vital, LabReport, Appointment } from '../types';

export const C = {
  bg: '#EEF2F7',
  card: '#FFFFFF',
  navy: '#0B1E3D',
  blue: '#1A54E8',
  teal: '#0A8A7A',
  red: '#D42B2B',
  orange: '#D97706',
  green: '#057A55',
  purple: '#6D28D9',
  pink: '#DB2777',
  muted: '#64748B',
  text: '#1E293B',
  border: '#DDE3ED',
  lBlue: '#EFF6FF',
  lRed: '#FFF1F1',
  lGreen: '#F0FDF9',
  lOrange: '#FFFBEB',
  lPurple: '#F5F3FF'
};

export const today = () => new Date().toISOString().slice(0, 10);

export const SEED_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Rajesh Kumar (Dad)',
    age: 62,
    role: 'Father',
    avatar: 'R',
    color: C.blue,
    blood: 'B+',
    phone: '+91-98765-43210',
    conditions: ['Type 2 Diabetes', 'Hypertension', 'High Cholesterol']
  },
  {
    id: 'm2',
    name: 'Sushma Kumar (Mom)',
    age: 58,
    role: 'Mother',
    avatar: 'S',
    color: C.purple,
    blood: 'O+',
    phone: '+91-87654-32109',
    conditions: ['Osteoarthritis', 'Vitamin D Deficiency']
  },
  {
    id: 'm3',
    name: 'Aryan Kumar',
    age: 28,
    role: 'Son',
    avatar: 'A',
    color: C.teal,
    blood: 'A+',
    phone: '+91-76543-21098',
    conditions: ['Mild Asthma']
  }
];

export const SEED_MEDICATIONS: Medication[] = [
  {
    id: 'md1',
    memberId: 'm1',
    name: 'Metformin 500mg',
    dose: '500mg',
    time: '09:00',
    freq: 'Twice Daily',
    taken: false,
    notes: 'After breakfast'
  },
  {
    id: 'md2',
    memberId: 'm1',
    name: 'Amlodipine 5mg',
    dose: '5mg',
    time: '21:00',
    freq: 'Daily',
    taken: false,
    notes: 'Before bed'
  },
  {
    id: 'md3',
    memberId: 'm1',
    name: 'Atorvastatin 10mg',
    dose: '10mg',
    time: '21:00',
    freq: 'Daily',
    taken: false,
    notes: 'After dinner'
  },
  {
    id: 'md4',
    memberId: 'm2',
    name: 'Calcium + D3',
    dose: '1 tab',
    time: '10:00',
    freq: 'Daily',
    taken: false,
    notes: 'After breakfast'
  },
  {
    id: 'md5',
    memberId: 'm2',
    name: 'Diclofenac Gel',
    dose: 'Apply',
    time: '',
    freq: 'As Needed',
    taken: null,
    notes: 'On joints'
  },
  {
    id: 'md6',
    memberId: 'm3',
    name: 'Salbutamol Inhaler',
    dose: '2 puffs',
    time: '',
    freq: 'As Needed',
    taken: null,
    notes: 'During attacks'
  }
];

export const SEED_VITALS: Vital[] = [
  {
    id: 'v1',
    memberId: 'm1',
    type: 'Blood Sugar',
    value: '184',
    unit: 'mg/dL',
    date: today(),
    notes: 'Post-meal'
  },
  {
    id: 'v2',
    memberId: 'm1',
    type: 'Blood Pressure',
    value: '148/92',
    unit: 'mmHg',
    date: today(),
    notes: 'Morning'
  },
  {
    id: 'v3',
    memberId: 'm1',
    type: 'Heart Rate',
    value: '78',
    unit: 'bpm',
    date: today(),
    notes: ''
  },
  {
    id: 'v4',
    memberId: 'm2',
    type: 'Blood Pressure',
    value: '126/82',
    unit: 'mmHg',
    date: today(),
    notes: ''
  },
  {
    id: 'v5',
    memberId: 'm3',
    type: 'SpO2',
    value: '97',
    unit: '%',
    date: today(),
    notes: 'After walk'
  }
];

export const SEED_LAB_REPORTS: LabReport[] = [
  {
    id: 'lr1',
    memberId: 'm1',
    reportName: 'Complete Blood Count + Lipid Panel',
    date: '2024-01-10',
    labName: 'Apollo Diagnostics',
    doctorName: 'Dr. Sharma',
    parameters: [
      {
        name: 'Hemoglobin',
        result: '11.8',
        unit: 'g/dL',
        normalRange: '13.0–17.0',
        status: 'Low',
        explanation: 'Protein carrying oxygen in red blood cells',
        suggestion: 'May indicate anemia — include iron-rich foods, consult doctor'
      },
      {
        name: 'WBC Count',
        result: '7200',
        unit: '/µL',
        normalRange: '4000–11000',
        status: 'Normal',
        explanation: 'White blood cells fighting infections',
        suggestion: 'Normal — no action needed'
      },
      {
        name: 'Platelet Count',
        result: '195000',
        unit: '/µL',
        normalRange: '150000–400000',
        status: 'Normal',
        explanation: 'Cells helping blood clot',
        suggestion: 'Normal'
      },
      {
        name: 'Blood Sugar (F)',
        result: '142',
        unit: 'mg/dL',
        normalRange: '70–100',
        status: 'High',
        explanation: 'Fasting glucose level',
        suggestion: 'Above normal — diet control, check with diabetologist'
      },
      {
        name: 'HbA1c',
        result: '7.8',
        unit: '%',
        normalRange: '< 5.7',
        status: 'High',
        explanation: '3-month average blood sugar',
        suggestion: 'Poorly controlled — medication review needed urgently'
      },
      {
        name: 'Creatinine',
        result: '1.1',
        unit: 'mg/dL',
        normalRange: '0.7–1.2',
        status: 'Normal',
        explanation: 'Kidney function marker',
        suggestion: 'Normal kidney function'
      },
      {
        name: 'Cholesterol (Total)',
        result: '238',
        unit: 'mg/dL',
        normalRange: '< 200',
        status: 'High',
        explanation: 'Total fat in blood',
        suggestion: 'High — reduce saturated fats, review statin dose'
      },
      {
        name: 'HDL',
        result: '38',
        unit: 'mg/dL',
        normalRange: '> 40',
        status: 'Low',
        explanation: 'Good cholesterol',
        suggestion: 'Low — increase aerobic exercise'
      },
      {
        name: 'LDL',
        result: '162',
        unit: 'mg/dL',
        normalRange: '< 100',
        status: 'High',
        explanation: 'Bad cholesterol',
        suggestion: 'High — strict diet, medication review'
      },
      {
        name: 'Triglycerides',
        result: '210',
        unit: 'mg/dL',
        normalRange: '< 150',
        status: 'High',
        explanation: 'Blood fats from diet',
        suggestion: 'High — avoid refined carbs and sugar'
      },
      {
        name: 'Vitamin D',
        result: '18',
        unit: 'ng/mL',
        normalRange: '30–100',
        status: 'Low',
        explanation: 'Essential for bones and immunity',
        suggestion: 'Supplement with Vitamin D3 2000 IU daily'
      }
    ]
  },
  {
    id: 'lr2',
    memberId: 'm2',
    reportName: 'Bone & Vitamin Panel',
    date: '2024-02-05',
    labName: 'SRL Diagnostics',
    doctorName: 'Dr. Rao',
    parameters: [
      {
        name: 'Vitamin D3',
        result: '14',
        unit: 'ng/mL',
        normalRange: '30–100',
        status: 'Low',
        explanation: 'Critical for calcium absorption',
        suggestion: 'Supplement 4000 IU/day + sun exposure'
      },
      {
        name: 'Calcium',
        result: '8.2',
        unit: 'mg/dL',
        normalRange: '8.5–10.5',
        status: 'Low',
        explanation: 'Mineral for bones and nerves',
        suggestion: 'Take Calcium+D3 daily'
      },
      {
        name: 'ESR',
        result: '42',
        unit: 'mm/hr',
        normalRange: '0–20',
        status: 'High',
        explanation: 'Inflammation marker',
        suggestion: 'Elevated — likely from arthritis, monitor'
      },
      {
        name: 'CRP',
        result: '8.6',
        unit: 'mg/L',
        normalRange: '< 5.0',
        status: 'High',
        explanation: 'Acute inflammation marker',
        suggestion: 'Consult rheumatologist'
      },
      {
        name: 'Uric Acid',
        result: '5.8',
        unit: 'mg/dL',
        normalRange: '2.4–6.0',
        status: 'Normal',
        explanation: 'Purine metabolism byproduct',
        suggestion: 'Normal'
      }
    ]
  }
];

export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'ap1',
    memberId: 'm1',
    doctor: 'Dr. Rahul Sharma',
    specialty: 'Cardiology',
    date: new Date(Date.now() + 2 * 864e5).toISOString().slice(0, 10),
    time: '10:30',
    notes: 'Quarterly cardiac review',
    status: 'upcoming'
  },
  {
    id: 'ap2',
    memberId: 'm1',
    doctor: 'Dr. Meena Gupta',
    specialty: 'Endocrinology',
    date: new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10),
    time: '14:00',
    notes: 'Diabetes + HbA1c review',
    status: 'upcoming'
  },
  {
    id: 'ap3',
    memberId: 'm2',
    doctor: 'Dr. Anjali Rao',
    specialty: 'Rheumatology',
    date: new Date(Date.now() + 4 * 864e5).toISOString().slice(0, 10),
    time: '11:00',
    notes: 'Arthritis follow-up',
    status: 'upcoming'
  }
];
