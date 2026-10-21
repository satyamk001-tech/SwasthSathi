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
    name: 'Arthur Jenkins',
    age: 72,
    role: 'Father',
    avatar: 'A',
    color: '#ba0035',
    blood: 'O+',
    phone: '+1 (555) 234-5678',
    conditions: ['Type 2 Diabetes', 'Hypertension', 'Cardiac Stent (LAD)'],
    allergies: ['Sulfa Antibiotics (Severe)', 'Latex'],
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfy--dLW2pGiqDiO2mZhKLzU9bfhScskFY8GRsEpMzP0BLB5sUAdwh9xMgbHr6A1fx2u6ZkPHq21CNwUdfuP8atol6TDOyIdE5DzzGWPyMfigr90yBmrom5buripsp0SFWX9B0qVuDA3lWd9zYm2s26nxJ1jsXyCEvETxQKt2k5XVEtw9ahuCi4LFktgSHhRb0I7_OO4lkya5h1JQ4tTButOM4KE_j4OQkTxvn_gmV5wngpl9hd0f0',
    triageNotes: 'Drug-eluting cardiac stent 2021. Primary proxy: Sarah Jenkins.'
  },
  {
    id: 'm2',
    name: 'Maya Jenkins',
    age: 8,
    role: 'Daughter',
    avatar: 'M',
    color: '#006a61',
    blood: 'A+',
    phone: '+1 (555) 234-5679',
    conditions: ['Mild Low Iron', 'Pediatric Wellness'],
    allergies: ['Penicillin (Moderate Hives)'],
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIuQ39CQ07qE_jDQnTlW3Mo4Ik-MpS6YsL8j_E2MQ-6mgJ_vuCJx07CVcLJZ8Wb1vWBtzY2LdWjIQbzlQi-sEgRvI6-WM21A_tvW-k0H4jSz-d1XSoJdo8Xniz9bHDIFoi4MHdMM0noBF7n1N9gKSgrBZdz9-3x4NJoqESEWo3kz-vLoAWa3gC0Y_AIRb7mnHh1sevJ6S7tTdEBP18O8tflo4aCvGIaNY4Swubqso56HeENO5Bm7XJ',
    triageNotes: 'Pediatric Medical Record #FC-89420. Avoid beta-lactam antibiotics.'
  },
  {
    id: 'm3',
    name: 'David Jenkins',
    age: 38,
    role: 'Spouse',
    avatar: 'D',
    color: '#006194',
    blood: 'O+',
    phone: '+1 (555) 234-5680',
    conditions: ['Hypertension (Controlled)'],
    allergies: ['None Reported'],
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCNYLAbrtBKMlLeJQeJoTMVgBYbgee3R9kqqLuvUO0hgKRWxEwrBO2oLzovqnnfYzBvcuFdvpFkVopUw3XtpbeGsUxjXznhj-lis1TtRWYZidu7Xs6CfpHqI_HoCRBwIbioJ2fT_MQ2LBwEHdnzRg7IyNzp9w2BAeVjdgDnKgwoD9jPWwxrdtZGQHsggr27szalKLJCreYF6SUgEyzTmY0DQ8CIqaJXzwLiBtv-w0vFFvuP_SkFKuE4',
    triageNotes: '100% adherence streak. Emergency proxy signer.'
  },
  {
    id: 'm4',
    name: 'Sarah Jenkins',
    age: 35,
    role: 'Self (Mother)',
    avatar: 'S',
    color: '#007bb9',
    blood: 'A+',
    phone: '+1 (555) 234-5681',
    conditions: ['General Wellness', 'Family Caregiver'],
    allergies: ['No Known Drug Allergies (NKDA)'],
    photoUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIzTV1iUMFC455-WQ2wvKCae_g8EvTrh8M0TfVlDonTu8ufPMeX593v3X1nEmgXou1lf74diUQQebz3U9vU6jdtjrl1RFOudqPJh47D5YcX9N8FX8nUUiPuTrn9p0imdYmOUKez3B5w-xHXPgpKkcHdhpZZqMagmDwLqWYkA4cM-ZfsSIlg9VTwdgJhwDIO0lqFLCDj2Rhz18TnEIgDpo2XmRpMEGIA4QyuGFUQcyAl-aSnF1eHNtX',
    triageNotes: 'Primary family guardian and account administrator.'
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
    notes: 'Take with citrus juice for absorption'
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
    name: 'Multivitamin + Omega 3',
    dose: '1 Softgel',
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
    notes: 'Resting'
  }
];

export const SEED_LAB_REPORTS: LabReport[] = [
  {
    id: 'lr1',
    memberId: 'm2',
    reportName: 'Pediatric CBC & Iron Panel',
    date: today(),
    labName: 'Quest Diagnostics Regional Lab (East)',
    doctorName: 'Dr. Emily Vance, MD',
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
        suggestion: 'Pair with Vitamin C for increased absorption'
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
    labName: 'Northwest Memorial Diagnostic Lab',
    doctorName: 'Dr. Aris Thorne',
    parameters: [
      {
        name: 'Blood Sugar (Fasting)',
        result: '142',
        unit: 'mg/dL',
        normalRange: '70–99',
        status: 'High',
        explanation: 'Fasting venous glucose measurement',
        suggestion: 'Elevated — continue Metformin and dietary monitoring'
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
    doctor: 'Dr. Emily Vance, MD',
    specialty: 'Pediatrics',
    date: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
    time: '10:30',
    notes: 'Pediatric Follow-up & Iron Panel review at Northside Pediatric Clinic • Suite 302',
    status: 'upcoming'
  },
  {
    id: 'ap2',
    memberId: 'm3',
    doctor: 'Dr. Aris Thorne',
    specialty: 'Cardiology',
    date: new Date(Date.now() + 864e5).toISOString().slice(0, 10),
    time: '10:30',
    notes: 'Cardiology Follow-up • Northwest Heart Pavilion',
    status: 'upcoming'
  },
  {
    id: 'ap3',
    memberId: 'm1',
    doctor: 'Dr. Rahul Sharma',
    specialty: 'Endocrinology',
    date: new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10),
    time: '14:00',
    notes: 'Quarterly diabetes & HbA1c review',
    status: 'upcoming'
  }
];
