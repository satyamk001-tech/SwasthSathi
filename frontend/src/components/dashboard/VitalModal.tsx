import React, { useState } from 'react';
import { C } from '../../data/seedData';
import { Modal } from '../common/Modal';
import { Inp } from '../common/Input';
import { Btn } from '../common/Button';

interface VitalModalProps {
  onClose: () => void;
  onSave: (vital: {
    type: string;
    value: string;
    unit: string;
    notes: string;
  }) => Promise<void>;
}

export const VitalModal: React.FC<VitalModalProps> = ({ onClose, onSave }) => {
  const [type, setType] = useState('Blood Pressure');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('mmHg');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (e: React.ChangeEvent<any>) => {
    const selected = e.target.value;
    const unitMap: Record<string, string> = {
      'Blood Pressure': 'mmHg',
      'Blood Sugar': 'mg/dL',
      'Heart Rate': 'bpm',
      'Temperature': '°F',
      'SpO2': '%',
      'Weight': 'kg',
      'Cholesterol': 'mg/dL'
    };
    setType(selected);
    setUnit(unitMap[selected] || '');
  };

  const handleSubmit = async () => {
    if (!value.trim()) return;
    setSaving(true);
    await onSave({
      type,
      value: value.trim(),
      unit,
      notes: notes.trim()
    });
    setSaving(false);
  };

  return (
    <Modal title="Record Health Vital" onClose={onClose}>
      <Inp
        label="Vital Sign"
        value={type}
        onChange={handleTypeChange}
        opts={['Blood Pressure', 'Blood Sugar', 'Heart Rate', 'Temperature', 'SpO2', 'Weight', 'Cholesterol']}
      />
      <Inp
        label={`Measurement Value (${unit})`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={type === 'Blood Pressure' ? '120/80' : type === 'Blood Sugar' ? '140' : '72'}
      />
      <Inp
        label="Measurement Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. Fasting / 2 hrs post-meal / after morning walk"
      />
      <Btn full bg={C.blue} onClick={handleSubmit} disabled={saving || !value}>
        {saving ? 'Recording...' : '✅ Save Measurement'}
      </Btn>
    </Modal>
  );
};
