import React, { useState } from 'react';
import { C } from '../../data/seedData';
import { Modal } from '../common/Modal';
import { Inp } from '../common/Input';
import { Btn } from '../common/Button';

interface MedicationModalProps {
  onClose: () => void;
  onSave: (med: {
    name: string;
    dose: string;
    time: string;
    freq: string;
    notes: string;
  }) => Promise<void>;
}

export const MedicationModal: React.FC<MedicationModalProps> = ({ onClose, onSave }) => {
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [time, setTime] = useState('');
  const [freq, setFreq] = useState('Daily');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      dose: dose.trim(),
      time,
      freq,
      notes: notes.trim()
    });
    setSaving(false);
  };

  return (
    <Modal title="Add Medication" onClose={onClose}>
      <Inp
        label="Medicine Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Metformin 500mg"
      />
      <Inp
        label="Dosage"
        value={dose}
        onChange={(e) => setDose(e.target.value)}
        placeholder="e.g. 1 tablet / 5ml"
      />
      <Inp
        label="Time of Day"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <Inp
        label="Frequency"
        value={freq}
        onChange={(e) => setFreq(e.target.value)}
        opts={['Daily', 'Twice Daily', 'Three times Daily', 'Weekly', 'As Needed', 'With Meals']}
      />
      <Inp
        label="Instructions / Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="e.g. Take after breakfast with warm water"
      />
      <Btn full bg={C.blue} onClick={handleSubmit} disabled={saving || !name}>
        {saving ? 'Adding...' : '✅ Save Medication'}
      </Btn>
    </Modal>
  );
};
