import { Hospital } from '../types';

export const HOSPITALS: Hospital[] = [
  {
    id: 'h1',
    name: 'City General Hospital',
    dist: 2.4,
    lat: 28.635,
    lng: 77.215,
    tags: ['24/7 ER', 'General Medicine', 'ICU'],
    erBeds: 4,
    phone: '+91-11-2345-6789',
    rating: 4.7,
    slots: ['07:30', '09:00', '10:30', '14:00', '16:30'],
    quiet: '07:30',
    emoji: '🏥'
  },
  {
    id: 'h2',
    name: 'Metro Heart Institute',
    dist: 5.1,
    lat: 28.620,
    lng: 77.230,
    tags: ['Cardiology', 'Cath Lab', 'Cardiac ICU'],
    erBeds: 2,
    phone: '+91-11-9876-5432',
    rating: 4.9,
    slots: ['08:30', '11:00', '14:30', '18:00'],
    quiet: '18:00',
    emoji: '❤️'
  },
  {
    id: 'h3',
    name: 'Apollo Multi-Specialty',
    dist: 7.3,
    lat: 28.605,
    lng: 77.250,
    tags: ['Multi-Specialty', 'Pediatrics', 'Oncology'],
    erBeds: 6,
    phone: '+91-11-5555-0000',
    rating: 4.5,
    slots: ['07:00', '09:30', '11:30', '17:00'],
    quiet: '07:00',
    emoji: '🏨'
  },
  {
    id: 'h4',
    name: 'AIIMS Emergency Centre',
    dist: 3.8,
    lat: 28.568,
    lng: 77.209,
    tags: ['Emergency', 'Trauma Centre', 'Research'],
    erBeds: 18,
    phone: '011-2659-3308',
    rating: 4.8,
    slots: ['08:00', '10:00', '13:00', '15:00'],
    quiet: '10:00',
    emoji: '🏛'
  },
  {
    id: 'h5',
    name: 'Safdarjung Super-Specialty Hospital',
    dist: 4.2,
    lat: 28.5689,
    lng: 77.2118,
    tags: ['Govt Hospital', '24/7 Casualty', 'Burn ICU'],
    erBeds: 12,
    phone: '+91-11-26165060',
    rating: 4.4,
    slots: ['08:30', '10:30', '12:30', '16:00'],
    quiet: '08:30',
    emoji: '🚑'
  },
  {
    id: 'h6',
    name: 'Fortis Escorts Heart Hospital',
    dist: 8.5,
    lat: 28.5665,
    lng: 77.2754,
    tags: ['Cardiac Care', 'Heart Failure ICU'],
    erBeds: 3,
    phone: '+91-11-47135000',
    rating: 4.8,
    slots: ['09:00', '11:30', '15:00', '17:30'],
    quiet: '17:30',
    emoji: '🩺'
  }
];

export const delhiHospitals = HOSPITALS;
