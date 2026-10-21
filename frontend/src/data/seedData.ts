import { Member, Medication, Vital, LabReport, Appointment } from '../types';

export const C = {
  bg: '#faf8ff',
  card: '#ffffff',
  navy: '#131b2e',
  blue: '#006194',
  teal: '#006a61',
  red: '#ba0035',
  orange: '#d97706',
  green: '#006a61',
  purple: '#6d28d9',
  pink: '#db2777',
  muted: '#707881',
  text: '#131b2e',
  border: '#bfc7d2',
  lBlue: '#cce5ff',
  lRed: '#ffdad6',
  lGreen: '#86f2e4',
  lOrange: '#fffbeb',
  lPurple: '#f5f3ff'
};

export const today = () => new Date().toISOString().slice(0, 10);

export const SEED_MEMBERS: Member[] = [
  {
    id: 'm1',
    name: 'Rajesh Kumar (Dad)',
    age: 68,
    role: 'Father',
    avatar: 'R',
    color: '#ba0035',
    blood: 'O+',
    phone: '+91 98765 43210',
    conditions: ['Type 2 Diabetes', 'Hypertension', 'Cardiac Stent (LAD)'],
    allergies: ['Sulfa Antibiotics (Severe)', 'Latex'],
    triageNotes: 'Drug-eluting cardiac stent (LAD Artery - 2021). Primary proxy: Harikit Kumar.'
  },
  {
    id: 'm2',
    name: 'Ananya Kumar',
    age: 8,
    role: 'Daughter',
    avatar: 'A',
    color: '#006a61',
    blood: 'A+',
    phone: '+91 98765 43211',
    conditions: ['Mild Low Iron', 'Pediatric Wellness'],
    allergies: ['Penicillin (Moderate Hives)'],
    triageNotes: 'Pediatric Health Record #SS-89420. Avoid beta-lactam antibiotics.'
  },
  {
    id: 'm3',
    name: 'Priya Kumar',
    age: 36,
    role: 'Spouse',
    avatar: 'P',
    color: '#006194',
    blood: 'O+',
    phone: '+91 98765 43212',
    conditions: ['Hypertension (Controlled)'],
    allergies: ['None Reported'],
    triageNotes: '100% adherence streak. Emergency family proxy.'
  },
  {
    id: 'm4',
    name: 'Harikit Kumar',
    age: 35,
    role: 'Self (Caregiver)',
    avatar: 'H',
    color: '#007bb9',
    blood: 'A+',
    phone: '+91 98765 43213',
    conditions: ['General Wellness', 'Family Caregiver'],
    allergies: ['No Known Drug Allergies (NKDA)'],
    triageNotes: 'Primary family guardian and SwasthSathi account administrator.'
  }
];

export const SEED_MEDICATIONS: Medication[] = [
  {
    id: 'md1',
    memberId: 'm1',
    name: 'Metformin 500mg',
    dose: '500mg',
    time: '08:00',
    freq: 'Twice Daily',
    taken: false,
    notes: 'Morning dose • Take with water after breakfast (Overdue)'
  },
  {
    id: 'md2',
    memberId: 'm1',
    name: 'Glipizide 5mg',
    dose: '5mg',
    time: '08:00',
    freq: 'Daily',
    taken: true,
    notes: 'Pre-breakfast morning dose'
  },
  {
    id: 'md3',
    memberId: 'm1',
    name: 'Lisinopril 10mg',
    dose: '10mg',
    time: '20:30',
    freq: 'Daily',
    taken: false,
    notes: 'Evening blood pressure control'
  },
  {
    id: 'md4',
    memberId: 'm2',
    name: 'Vitamin D3 Drops',
    dose: '1000 IU',
    time: '13:00',
    freq: 'Daily',
    taken: false,
    notes: 'Mid-day pediatric supplement'
  },
  {
    id: 'md5',
    memberId: 'm2',
    name: 'Elemental Iron Drops',
    dose: '15mg',
    time: '13:00',
    freq: 'Daily',
    taken: false,
    notes: 'Take with lemon water or orange juice for absorption'
  },
  {
    id: 'md6',
    memberId: 'm3',
    name: 'Amlodipine 5mg',
    dose: '5mg',
    time: '08:00',
    freq: 'Daily',
    taken: true,
    notes: 'Morning blood pressure dose'
  },
  {
    id: 'md7',
    memberId: 'm3',
    name: 'Atorvastatin 10mg',
    dose: '10mg',
    time: '20:30',
    freq: 'Daily',
    taken: false,
    notes: 'Evening lipid management'
  },
  {
    id: 'md8',
    memberId: 'm4',
    name: 'Multivitamin Daily',
    dose: '1 Capsule',
    time: '08:00',
    freq: 'Daily',
    taken: true,
    notes: 'Taken with breakfast'
  }
];

export const SEED_VITALS: Vital[] = [
  {
    id: 'v1',
    memberId: 'm1',
    type: 'Blood Pressure',
    value: '128/82',
    unit: 'mmHg',
    date: today(),
    notes: 'Morning reading • Normal control'
  },
  {
    id: 'v2',
    memberId: 'm1',
    type: 'Blood Sugar',
    value: '142',
    unit: 'mg/dL',
    date: today(),
    notes: 'Fasting glucose'
  },
  {
    id: 'v3',
    memberId: 'm2',
    type: 'Hemoglobin',
    value: '11.5',
    unit: 'g/dL',
    date: today(),
    notes: 'Mild Low • Follow-up scheduled'
  },
  {
    id: 'v4',
    memberId: 'm3',
    type: 'Blood Pressure',
    value: '122/80',
    unit: 'mmHg',
    date: today(),
    notes: 'Optimal range'
  },
  {
    id: 'v5',
    memberId: 'm4',
    type: 'Heart Rate',
    value: '72',
    unit: 'bpm',
    date: today(),
    notes: 'Resting pulse'
  }
];

export const SEED_LAB_REPORTS: LabReport[] = [
  {
    id: 'lr1',
    memberId: 'm2',
    reportName: 'Pediatric CBC & Iron Panel',
    date: today(),
    labName: 'Dr. Lal PathLabs National Reference Lab, New Delhi',
    doctorName: 'Dr. Neha Sharma, MD (Pediatrics)',
    parameters: [
      {
        name: 'Hemoglobin',
        result: '11.5',
        unit: 'g/dL',
        normalRange: '12.0–15.5',
        status: 'Low',
        explanation: 'Oxygen-carrying protein in red blood cells',
        suggestion: 'Mild low — pediatrician recommended dietary iron or drops'
      },
      {
        name: 'Hematocrit',
        result: '34.2',
        unit: '%',
        normalRange: '35.0–45.0',
        status: 'Low',
        explanation: 'Percentage of blood composed of RBCs',
        suggestion: 'Correlates with mild low iron'
      },
      {
        name: 'WBC Count',
        result: '6800',
        unit: '/µL',
        normalRange: '5000–12000',
        status: 'Normal',
        explanation: 'Infection-fighting cells',
        suggestion: 'Optimal immune markers'
      },
      {
        name: 'Platelet Count',
        result: '245000',
        unit: '/µL',
        normalRange: '150000–450000',
        status: 'Normal',
        explanation: 'Blood clotting cell fragments',
        suggestion: 'Normal coagulation capacity'
      },
      {
        name: 'Serum Iron',
        result: '48',
        unit: 'µg/dL',
        normalRange: '50–120',
        status: 'Low',
        explanation: 'Circulating iron levels in bloodstream',
        suggestion: 'Pair with Vitamin C (lemon/amla) for increased absorption'
      },
      {
        name: 'Ferritin',
        result: '16',
        unit: 'ng/mL',
        normalRange: '20–200',
        status: 'Low',
        explanation: 'Stored iron reserves in tissue',
        suggestion: 'Re-test in 6 weeks after supplementation'
      }
    ]
  },
  {
    id: 'lr2',
    memberId: 'm1',
    reportName: 'Comprehensive Metabolic & Lipid Panel',
    date: '2024-01-15',
    labName: 'Apollo Diagnostics Centre',
    doctorName: 'Dr. Rahul Sharma, MD (Cardiology)',
    parameters: [
      {
        name: 'Blood Sugar (Fasting)',
        result: '142',
        unit: 'mg/dL',
        normalRange: '70–99',
        status: 'High',
        explanation: 'Fasting venous glucose measurement',
        suggestion: 'Elevated — continue Metformin and strict low-glycemic diet'
      },
      {
        name: 'HbA1c',
        result: '7.8',
        unit: '%',
        normalRange: '< 5.7',
        status: 'High',
        explanation: '90-day glycosylated hemoglobin average',
        suggestion: 'Requires endocrine medication adjustment'
      },
      {
        name: 'Cholesterol (Total)',
        result: '215',
        unit: 'mg/dL',
        normalRange: '< 200',
        status: 'High',
        explanation: 'Total serum cholesterol',
        suggestion: 'Continue statin therapy'
      },
      {
        name: 'Creatinine',
        result: '1.0',
        unit: 'mg/dL',
        normalRange: '0.7–1.3',
        status: 'Normal',
        explanation: 'Kidney filtration marker',
        suggestion: 'Stable renal function'
      }
    ]
  }
];

export const SEED_APPOINTMENTS: Appointment[] = [
  {
    id: 'ap1',
    memberId: 'm2',
    doctor: 'Dr. Neha Sharma, MD',
    specialty: 'Pediatrics',
    date: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
    time: '10:30',
    notes: "Pediatric Follow-up & Iron Panel review at Apollo Children's Clinic • Saket, New Delhi",
    status: 'upcoming'
  },
  {
    id: 'ap2',
    memberId: 'm3',
    doctor: 'Dr. Rahul Sharma, MD',
    specialty: 'Cardiology',
    date: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
    time: '10:30',
    notes: 'Cardiology Follow-up • Fortis Escorts Heart Institute',
    status: 'upcoming'
  },
  {
    id: 'ap3',
    memberId: 'm1',
    doctor: 'Dr. Rajesh Gupta, MD',
    specialty: 'Endocrinology',
    date: new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10),
    time: '14:00',
    notes: 'Quarterly diabetes & HbA1c review at AIIMS New Delhi',
    status: 'upcoming'
  }
];
