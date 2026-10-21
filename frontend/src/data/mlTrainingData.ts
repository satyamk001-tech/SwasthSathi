export interface TrainingCase {
  t: string;
  l: string;
  u: 'emergency' | 'urgent' | 'routine';
}

export const ML_TRAINING_DATA: TrainingCase[] = [
  { t: 'chest pain shortness breath heart palpitation pressure tightness radiating left arm', l: 'Cardiology', u: 'emergency' },
  { t: 'heart attack angina radiating arm jaw sweating dizziness collapse', l: 'Cardiology', u: 'emergency' },
  { t: 'hypertension high blood pressure pounding headache blurry vision epistaxis', l: 'Cardiology', u: 'urgent' },
  { t: 'joint pain swelling stiffness arthritis knees inflammation osteoarthritis rheumatoid', l: 'Orthopedics', u: 'routine' },
  { t: 'back pain spine fracture muscle spasm severe injury lumbar disc herniation', l: 'Orthopedics', u: 'urgent' },
  { t: 'cough wheezing breathing difficulty asthma attack bronchitis mucus fever sputum', l: 'Pulmonology', u: 'urgent' },
  { t: 'blood sugar diabetes high glucose insulin thirst frequent urination ketoacidosis', l: 'Endocrinology', u: 'urgent' },
  { t: 'thyroid weight gain fatigue cold intolerance hair loss hormone imbalance goitre', l: 'Endocrinology', u: 'routine' },
  { t: 'severe stomach pain acute nausea vomiting diarrhea abdomen appendicitis cramps acidity', l: 'Gastroenterology', u: 'urgent' },
  { t: 'sudden headache migraine dizziness seizure stroke numbness facial droop speech weakness', l: 'Neurology', u: 'emergency' },
  { t: 'skin rash itching eczema psoriasis hives bumps redness allergy fungal infection', l: 'Dermatology', u: 'routine' },
  { t: 'eye pain sudden vision loss blurred redness discharge glaucoma trauma corneal ulcer', l: 'Ophthalmology', u: 'urgent' },
  { t: 'ear pain hearing loss infection discharge tinnitus blocked sinus earache', l: 'ENT', u: 'routine' },
  { t: 'sore throat throat irritation cold fever runny nose tonsillitis hoarseness', l: 'ENT', u: 'routine' },
  { t: 'child high fever vaccination pediatric lethargy poor feeding dehydration convulsions', l: 'Pediatrics', u: 'urgent' },
  { t: 'kidney flank pain painful urination blood urine UTI stones burning sensation', l: 'Nephrology', u: 'urgent' },
  { t: 'depression anxiety mental stress panic attack insomnia suicidal thoughts mood swing', l: 'Psychiatry', u: 'urgent' },
  { t: 'profuse bleeding open wound fracture trauma vehicular accident deep laceration hemorrhage', l: 'Emergency', u: 'emergency' },
  { t: 'severe allergy anaphylaxis swelling throat lips tongue difficulty breathing shock hives', l: 'Emergency', u: 'emergency' }
];
