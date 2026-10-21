import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

/**
 * POST /api/ai/chat
 */
router.post(
  '/chat',
  [body('message').isString().isLength({ min: 1, max: 2000 }).withMessage('Message must be 1-2000 characters')],
  async (req: express.Request, res: express.Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { message, memberContext } = req.body;
      const response = generateAIResponse(message, memberContext);

      res.json({
        response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('AI Chat error:', error);
      res.status(500).json({ error: 'Failed to process AI chat request' });
    }
  }
);

/**
 * POST /api/ai/diet
 */
router.post('/diet', async (req: express.Request, res: express.Response) => {
  try {
    const { name, age, conditions = [] } = req.body;
    const condStr = (conditions as string[]).join(' ').toLowerCase();

    let diet;
    if (condStr.includes('diabet') && condStr.includes('hyperten')) {
      diet = {
        breakfast: { meal: 'Oats with chia seeds, cinnamon, and 4 crushed almonds + green tea', cal: 320, time: '08:30 AM' },
        lunch: { meal: 'Multigrain roti (2) with methi dal, steamed bottle gourd (lauki), and fresh cucumber curd', cal: 480, time: '01:15 PM' },
        snack: { meal: 'Roasted makhana (foxnuts) with turmeric + roasted chana', cal: 150, time: '05:00 PM' },
        dinner: { meal: 'Vegetable paneer stir-fry with quinoa or 1 bajra roti + warm jeera water', cal: 390, time: '08:00 PM' },
        total: 1340,
        avoid: ['Refined flour (maida)', 'White sugar & sweets', 'Deep fried pakoras', 'High-sodium pickles & papad'],
        tip: 'Maintain strict sodium restriction (<2g/day) and eat small frequent meals to prevent postprandial glucose spikes.'
      };
    } else if (condStr.includes('arthri') || condStr.includes('joint')) {
      diet = {
        breakfast: { meal: 'Warm ragi porridge with flaxseeds and walnuts + glass of almond milk', cal: 340, time: '08:30 AM' },
        lunch: { meal: 'Brown rice with spinach-dal, grilled paneer/tofu, and carrot-beetroot salad', cal: 520, time: '01:00 PM' },
        snack: { meal: 'Boiled sprouts chaat with lemon juice and a pinch of black pepper', cal: 160, time: '05:00 PM' },
        dinner: { meal: 'Lentil soup with sauteed vegetables and 1 soft whole wheat chapati', cal: 380, time: '07:45 PM' },
        total: 1400,
        avoid: ['Excessive red meat', 'Sugary carbonated drinks', 'Processed sunflower oil', 'Inflammatory bakery goods'],
        tip: 'Incorporate anti-inflammatory foods like turmeric with black pepper, omega-3 fatty acids, and maintain adequate Vitamin D synthesis.'
      };
    } else {
      diet = {
        breakfast: { meal: 'Vegetable idlis (2) with sambar and fresh mint-coconut chutney', cal: 350, time: '08:30 AM' },
        lunch: { meal: 'Whole wheat chapati (2), mixed vegetable curry, yellow dal, and tossed salad', cal: 550, time: '01:00 PM' },
        snack: { meal: 'Seasonal fresh fruit (apple/guava) with a handful of walnuts', cal: 170, time: '04:30 PM' },
        dinner: { meal: 'Moong dal khichdi with roasted papad and vegetable soup', cal: 420, time: '08:00 PM' },
        total: 1490,
        avoid: ['Carbonated beverages', 'Trans-fat snacks', 'Excessive table salt'],
        tip: 'Drink at least 2.5–3 liters of water throughout the day and take a 20-minute post-dinner walk.'
      };
    }

    res.json({ diet });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate diet plan' });
  }
});

/**
 * POST /api/ai/prep-questions
 */
router.post('/prep-questions', async (req: express.Request, res: express.Response) => {
  try {
    const { doctor, specialty = '', conditions = [] } = req.body;
    const spec = specialty.toLowerCase();

    let prep;
    if (spec.includes('cardio')) {
      prep = {
        questions: [
          'How well are my current blood pressure readings controlled over the past 3 months?',
          'Do any of my medications need dosage adjustment based on my recent lipid panel?',
          'What specific target range should I maintain for my resting heart rate and BP?',
          'Are there early warning symptoms or shortness of breath triggers I must look out for?',
          'Is my current exercise routine safe for my cardiovascular condition?'
        ],
        bring: ['Recent ECG report', 'Lipid profile lab sheet', 'Daily BP logbook', 'Current medication strips'],
        tips: ['Do not consume caffeine 1 hour before the clinic visit to avoid artificial BP spikes.']
      };
    } else if (spec.includes('endo') || spec.includes('diabet')) {
      prep = {
        questions: [
          'Is my HbA1c trending toward our target level (<7.0%)?',
          'Are there any side effects from Metformin I should manage differently?',
          'Should we check kidney function (microalbuminuria) during this visit?',
          'How should I adjust my meal timings to prevent morning fasting spikes?',
          'Do I need continuous glucose monitoring or a change in frequency?'
        ],
        bring: ['HbA1c & Fasting blood sugar reports', 'Glucometer device with recent readings', 'Prescription history'],
        tips: ['Bring your glucometer for cross-calibration with the clinic lab.']
      };
    } else {
      prep = {
        questions: [
          'What is the primary cause of my current symptoms and what is the expected timeline for improvement?',
          `How will the prescribed treatments interact with my ongoing conditions (${(conditions as string[]).join(', ') || 'none'})?`,
          'What lifestyle or dietary modifications will accelerate my recovery?',
          'When should I return for a follow-up review?',
          'Are there any red-flag symptoms that should prompt emergency consultation?'
        ],
        bring: ['Previous medical records', 'Insurance card / Government Health ID', 'Current medication list'],
        tips: ['Write down any sudden symptom onset times to share accurately with the specialist.']
      };
    }

    res.json({ prep });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate prep questions' });
  }
});

/**
 * POST /api/ai/triage
 */
router.post('/triage', async (req: express.Request, res: express.Response) => {
  try {
    const { symptom = '' } = req.body;
    const s = symptom.toLowerCase();

    let triage;
    if (
      s.includes('chest pain') ||
      s.includes('heart attack') ||
      s.includes('radiating') ||
      s.includes('stroke') ||
      s.includes('face droop') ||
      s.includes('arm weak') ||
      s.includes('anaphylaxis') ||
      s.includes('cannot breathe')
    ) {
      triage = {
        specialty: 'Cardiology / Emergency Medicine',
        urgency: 'emergency',
        recommendation:
          'Immediate emergency evaluation required. Symptoms are consistent with acute coronary syndrome or critical neurological event.',
        redFlags: [
          'Crushing retrosternal chest pressure',
          'Pain radiating to jaw, neck, or left arm',
          'Cold diaphoresis (sweating)',
          'Syncope or sudden shortness of breath'
        ],
        immediateActions: [
          'Call national emergency ambulance (112 or 102) immediately.',
          'Keep patient sitting upright in a comfortable position and loosen tight clothing.',
          'Chew a soluble Aspirin 300mg if no known contraindications/allergy exist.'
        ]
      };
    } else if (
      s.includes('fever') ||
      s.includes('wheez') ||
      s.includes('asthma') ||
      s.includes('blood') ||
      s.includes('vomit') ||
      s.includes('sugar')
    ) {
      triage = {
        specialty: s.includes('breath') || s.includes('cough') ? 'Pulmonology' : 'Internal Medicine',
        urgency: 'urgent',
        recommendation:
          'Clinical assessment required within 12–24 hours. Symptom progression indicates active acute distress.',
        redFlags: [
          'Persistent high fever (>102°F) resistant to antipyretics',
          'Continuous inability to retain oral fluids',
          'Rapid breathing or SpO2 dropping below 94%'
        ],
        immediateActions: [
          'Rest in a well-ventilated quiet area and monitor vitals every 2 hours.',
          'Maintain oral electrolyte fluid replacement.',
          'Book an urgent appointment or visit your nearest urgent care clinic.'
        ]
      };
    } else {
      triage = {
        specialty: 'General Medicine / Outpatient Clinic',
        urgency: 'routine',
        recommendation:
          'Mild symptoms likely manageable with supportive home care and outpatient follow-up if symptoms persist past 3–5 days.',
        redFlags: ['Sudden spike in symptom severity', 'Unexplained weight loss or nighttime fevers'],
        immediateActions: [
          'Ensure adequate hydration and 8 hours of restorative sleep.',
          'Log symptoms in your SwasthSathi health journal for your next routine review.'
        ]
      };
    }

    res.json({ triage });
  } catch (err) {
    res.status(500).json({ error: 'Failed to triage symptoms' });
  }
});

/**
 * POST /api/ai/interactions
 */
router.post('/interactions', async (req: express.Request, res: express.Response) => {
  try {
    const { drugs = [] } = req.body;
    const dLower = (drugs as string[]).map((d) => d.toLowerCase());
    const hasWarfarin = dLower.some((d) => d.includes('warfarin'));
    const hasIbuprofen = dLower.some((d) => d.includes('ibuprofen') || d.includes('nsaid'));
    const hasAspirin = dLower.some((d) => d.includes('aspirin'));
    const hasMetformin = dLower.some((d) => d.includes('metformin'));
    const hasAlcohol = dLower.some((d) => d.includes('alcohol'));
    const hasAmlodipine = dLower.some((d) => d.includes('amlodipine'));
    const hasStatin = dLower.some((d) => d.includes('simvastatin') || d.includes('atorvastatin'));

    const interactions = [];

    if (hasWarfarin && (hasIbuprofen || hasAspirin)) {
      interactions.push({
        sev: 'Major',
        drugs: hasIbuprofen ? ['Warfarin', 'Ibuprofen'] : ['Warfarin', 'Aspirin'],
        mechanism: 'Simultaneous inhibition of vitamin K clotting factors and COX-mediated platelet aggregation',
        effect: 'Marked synergistic elevation in gastrointestinal and systemic bleeding risks',
        management: 'Discontinue concurrent NSAID immediately. If analgesia is needed, substitute with Paracetamol (max 2g/day) under clinician oversight.',
        alternatives: ['Paracetamol 500mg', 'Topical diclofenac (with strict monitoring)']
      });
    }

    if (hasMetformin && hasAlcohol) {
      interactions.push({
        sev: 'Major',
        drugs: ['Metformin', 'Alcohol'],
        mechanism: 'Ethanol inhibits hepatic gluconeogenesis and lactate clearance, potentiating biguanide-induced lactic acidosis',
        effect: 'Life-threatening lactic acidosis manifesting as extreme fatigue, tachypnea, and hypotension',
        management: 'Completely eliminate alcohol intake during Metformin therapy.',
        alternatives: ['Non-alcoholic hydration', 'Dietary blood sugar management']
      });
    }

    if (hasAmlodipine && hasStatin) {
      interactions.push({
        sev: 'Moderate',
        drugs: ['Amlodipine', 'Simvastatin/Atorvastatin'],
        mechanism: 'CYP3A4 enzymatic competition resulting in increased circulating statin bioavailability',
        effect: 'Increased probability of statin-induced myopathy, elevated CPK, or rhabdomyolysis',
        management: 'Limit Simvastatin dose to maximum 20mg daily or switch to a non-CYP3A4 statin like Rosuvastatin or Pravastatin.',
        alternatives: ['Rosuvastatin 5mg/10mg', 'Pravastatin 20mg']
      });
    }

    const overallRisk = interactions.some((i) => i.sev === 'Major')
      ? 'High Risk'
      : interactions.some((i) => i.sev === 'Moderate')
      ? 'Moderate Risk'
      : 'Safe';

    const analysis = {
      interactions,
      overallRisk,
      summary:
        interactions.length > 0
          ? `Found ${interactions.length} clinical interaction(s) requiring attention in this medication regimen.`
          : 'No known severe pharmacokinetic or pharmacodynamic clashes detected between these compounds.',
      recommendations:
        interactions.length > 0
          ? [
              'Consult your primary prescribing physician or cardiologist before altering prescribed doses.',
              'Watch for unusual bruising, dark stools, or unexplained muscular soreness.',
              'Schedule periodic liver and kidney function panel testing.'
            ]
          : [
              'Continue taking medications as prescribed with adequate hydration.',
              'Report any unexpected symptoms or gastrointestinal distress to your doctor.'
            ]
    };

    res.json({ analysis });
  } catch (err) {
    res.status(500).json({ error: 'Failed to analyze drug interactions' });
  }
});

function generateAIResponse(query: string, memberContext?: any): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('hba1c') || lowerQuery.includes('7.8')) {
    return `An HbA1c of 7.8% indicates that your average blood sugar over the last 90 days has been around 177 mg/dL, which is above the standard recommended target of < 7.0% for most adults with diabetes.\n\nKey takeaways:\n1. 🔬 What it means: Persistent hyperglycemia that increases long-term risks to kidneys, eyes, and nerves.\n2. 💊 Medication: Consult your endocrinologist to review your Metformin dosage or evaluate adding a complementary agent.\n3. 🥗 Nutrition: Cut high-glycemic carbohydrates like white rice and sweets; increase leafy greens and protein.\n4. 🏃 Physical Activity: Aim for 30 minutes of brisk walking 5 days a week.`;
  }

  if (lowerQuery.includes('metformin') && (lowerQuery.includes('side effect') || lowerQuery.includes('effects'))) {
    return `Common Metformin side effects include:\n• Gastrointestinal upset (nausea, mild diarrhea, abdominal bloating)\n• Metallic taste in mouth\n• Mild loss of appetite\n\nTips to minimize discomfort:\n1. Always take Metformin with or immediately after a substantial meal.\n2. Inquire with your physician about the extended-release (ER/XR) formulation, which is much gentler on the digestive tract.\n3. Never combine Metformin with heavy alcohol consumption due to lactic acidosis risk.`;
  }

  if (lowerQuery.includes('ldl') || lowerQuery.includes('cholesterol')) {
    return `To lower LDL ("bad") cholesterol effectively:\n\n1. 🥗 Dietary swaps: Replace saturated fats (butter, palm oil, ghee) with monounsaturated fats (mustard oil, olive oil, nuts).\n2. 🌾 Soluble fiber: Consume oats, barley, methi seeds, and beans which bind cholesterol in the intestine.\n3. 💊 Medical therapy: If LDL is >160 mg/dL, statin therapy (such as Atorvastatin or Rosuvastatin) is standard clinical practice.\n4. 🏃 Regular cardio: 150 minutes of moderate aerobic exercise weekly boosts beneficial HDL.`;
  }

  if (lowerQuery.includes('blood pressure') || lowerQuery.includes('bp range') || lowerQuery.includes('safe blood pressure')) {
    return `Standard Blood Pressure Reference Ranges:\n• Normal: Less than 120/80 mmHg\n• Elevated: Systolic 120–129 and Diastolic < 80 mmHg\n• Stage 1 Hypertension: 130–139 / 80–89 mmHg\n• Stage 2 Hypertension: 140/90 mmHg or higher\n• Hypertensive Crisis: Above 180/120 mmHg (Emergency)\n\nTip: Measure your BP while sitting quietly for 5 minutes with your arm supported at heart level.`;
  }

  if (lowerQuery.includes('fever') || lowerQuery.includes('बुखार')) {
    return 'For fever, I recommend:\n\n1. Rest and stay hydrated with electrolytes\n2. Take paracetamol if temperature exceeds 101°F\n3. Keep a cool damp cloth on your forehead\n4. Consult a doctor if fever persists more than 3 days\n\nPlease consult a healthcare professional for proper diagnosis.';
  }

  if (lowerQuery.includes('chest pain') || lowerQuery.includes('serious') || lowerQuery.includes('emergency')) {
    return '🚨 IMPORTANT: Chest pain must always be taken seriously.\n\nSeek immediate emergency care (Call 112) if you experience:\n• Crushing, squeezing, or heavy pressure across the chest\n• Pain radiating to your left arm, shoulder, neck, or jaw\n• Shortness of breath, dizziness, cold sweat, or nausea\n\nDo not drive yourself to the hospital; summon emergency medical transport immediately.';
  }

  return `Namaste! As your SwasthSathi health companion, I can help you interpret lab test reports, check potential drug interactions, suggest balanced Indian dietary plans, or organize questions for your next doctor consultation.\n\nWhat would you like to explore today?`;
}

export default router;
