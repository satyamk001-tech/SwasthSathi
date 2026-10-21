import React, { useState } from 'react';
import { C, today } from '../../data/seedData';
import { Modal } from '../common/Modal';
import { Inp } from '../common/Input';
import { Btn } from '../common/Button';

interface AppointmentModalProps {
  onClose: () => void;
  onSave: (appt: {
    doctor: string;
    specialty: string;
    date: string;
    time: string;
    notes: string;
  }) => Promise<void>;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ onClose, onSave }) => {
  const [doctor, setDoctor] = useState('');
  const [specialty, setSpecialty] = useState('Cardiology');
  const [date, setDate] = useState(today());
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!doctor.trim() || !date) return;
    setSaving(true);
    await onSave({
      doctor: doctor.trim(),
      specialty,
      date,
      time,
      notes: notes.trim()
    });
    setSaving(false);
  };

  return (
    <Modal title="Book Doctor Appointment" onClose={onClose}>
      <Inp
        label="Doctor / Hospital Name"
        value={doctor}
        onChange={(e) => setDoctor(e.target.value)}
        placeholder="e.g. Dr. Rahul Sharma"
      />
      <Inp
        label="Medical Specialty"
        value={specialty}
        onChange={(e) => setSpecialty(e.target.value)}
        opts={[
          'Cardiology',
          'Endocrinology / Diabetes',
          'General Medicine',
          'Orthopedics',
          'Pulmonology',
          'Neurology',
          'Dermatology',
          'Pediatrics',
          'Gastroenterology',
          'ENT',
          'Ophthalmology'
        ]}
      />
      <Inp
        label="Date"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Inp
        label="Time"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <Inp
        label="Reason for Visit / Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="e.g. Quarterly BP checkup and prescription renewal"
      />
      <Btn full bg={C.blue} onClick={handleSubmit} disabled={saving || !doctor || !date}>
        {saving ? 'Booking...' : '📅 Save Appointment'}
      </Btn>
    </Modal>
  );
};
