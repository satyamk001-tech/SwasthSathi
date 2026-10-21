import React, { useState } from 'react';
import { Member } from '../../types';
import { C } from '../../data/seedData';
import { Modal } from '../common/Modal';
import { Inp } from '../common/Input';
import { Btn } from '../common/Button';

interface MemberModalProps {
  initial?: Partial<Member> | null;
  onClose: () => void;
  onSave: (memberData: {
    id?: string;
    name: string;
    age: number;
    role: string;
    blood: string;
    phone: string;
    conditions: string[];
    color?: string;
  }) => Promise<void>;
}

export const MemberModal: React.FC<MemberModalProps> = ({ initial, onClose, onSave }) => {
  const [name, setName] = useState(initial?.name || '');
  const [age, setAge] = useState(initial?.age ? String(initial.age) : '');
  const [role, setRole] = useState(initial?.role || 'Patient');
  const [blood, setBlood] = useState(initial?.blood || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [conds, setConds] = useState((initial?.conditions || []).join(', '));
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !age.trim()) return;
    setSaving(true);
    await onSave({
      id: initial?.id,
      name: name.trim(),
      age: parseInt(age, 10),
      role,
      blood,
      phone: phone.trim(),
      conditions: conds
        ? conds.split(',').map((c) => c.trim()).filter(Boolean)
        : [],
      color: initial?.color
    });
    setSaving(false);
  };

  return (
    <Modal title={initial?.id ? 'Edit Family Member' : 'Add Family Member'} onClose={onClose}>
      <Inp
        label="Full Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Priya Kumar (Daughter)"
      />
      <Inp
        label="Age"
        type="number"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        placeholder="e.g. 32"
      />
      <Inp
        label="Role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        opts={['Patient', 'Father', 'Mother', 'Son', 'Daughter', 'Child', 'Guardian', 'Grandparent']}
      />
      <Inp
        label="Blood Group"
        value={blood}
        onChange={(e) => setBlood(e.target.value)}
        opts={[
          { v: '', l: '—' },
          { v: 'A+', l: 'A+' },
          { v: 'A-', l: 'A-' },
          { v: 'B+', l: 'B+' },
          { v: 'B-', l: 'B-' },
          { v: 'O+', l: 'O+' },
          { v: 'O-', l: 'O-' },
          { v: 'AB+', l: 'AB+' },
          { v: 'AB-', l: 'AB-' }
        ]}
      />
      <Inp
        label="Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="+91-98765-43210"
      />
      <Inp
        label="Health Conditions (comma separated)"
        value={conds}
        onChange={(e) => setConds(e.target.value)}
        placeholder="Type 2 Diabetes, Hypertension, Asthma"
      />
      <Btn full bg={C.blue} onClick={handleSubmit} disabled={saving || !name || !age}>
        {saving ? 'Saving...' : initial?.id ? '✅ Update Member' : '✅ Add Member'}
      </Btn>
    </Modal>
  );
};
