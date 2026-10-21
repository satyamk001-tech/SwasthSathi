import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

interface RiskForm {
  age: number;
  bmi: number;
  bloodPressure: 'normal' | 'elevated' | 'high';
  diabetes: 'no' | 'pre' | 'yes';
  smoking: 'no' | 'yes';
  familyHistory: 'no' | 'yes';
}

// Calculate health risk
router.post('/calculate', [
  body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be 1-120'),
  body('bmi').isFloat({ min: 10, max: 60 }).withMessage('BMI must be 10-60'),
  body('bloodPressure').isIn(['normal', 'elevated', 'high']).withMessage('Invalid blood pressure value'),
  body('diabetes').isIn(['no', 'pre', 'yes']).withMessage('Invalid diabetes value'),
  body('smoking').isIn(['no', 'yes']).withMessage('Invalid smoking value'),
  body('familyHistory').isIn(['no', 'yes']).withMessage('Invalid family history value')
], (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const form: RiskForm = req.body;
    const result = calculateRisk(form);

    res.json({
      riskScore: result.score,
      riskLevel: result.level,
      recommendations: result.recommendations,
      factors: result.factors
    });
  } catch (error) {
    console.error('Risk calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate risk' });
  }
});

function calculateRisk(form: RiskForm) {
  let score = 0;
  const factors: string[] = [];

  // Age factor
  if (form.age >= 60) {
    score += 25;
    factors.push('Age ≥ 60 (+25 points)');
  } else if (form.age >= 45) {
    score += 15;
    factors.push('Age 45-59 (+15 points)');
  } else if (form.age >= 30) {
    score += 5;
    factors.push('Age 30-44 (+5 points)');
  }

  // BMI factor
  if (form.bmi >= 30) {
    score += 25;
    factors.push('BMI ≥ 30 (Obese, +25 points)');
  } else if (form.bmi >= 25) {
    score += 15;
    factors.push('BMI 25-29.9 (Overweight, +15 points)');
  } else if (form.bmi >= 18.5) {
    factors.push('BMI 18.5-24.9 (Normal)');
  } else {
    score += 5;
    factors.push('BMI < 18.5 (Underweight, +5 points)');
  }

  // Blood pressure factor
  if (form.bloodPressure === 'high') {
    score += 20;
    factors.push('High blood pressure (+20 points)');
  } else if (form.bloodPressure === 'elevated') {
    score += 10;
    factors.push('Elevated blood pressure (+10 points)');
  } else {
    factors.push('Normal blood pressure');
  }

  // Diabetes factor
  if (form.diabetes === 'yes') {
    score += 20;
    factors.push('Diabetes (+20 points)');
  } else if (form.diabetes === 'pre') {
    score += 10;
    factors.push('Pre-diabetic (+10 points)');
  } else {
    factors.push('No diabetes');
  }

  // Smoking factor
  if (form.smoking === 'yes') {
    score += 15;
    factors.push('Smoking (+15 points)');
  } else {
    factors.push('Non-smoker');
  }

  // Family history factor
  if (form.familyHistory === 'yes') {
    score += 15;
    factors.push('Family history of disease (+15 points)');
  } else {
    factors.push('No family history');
  }

  // Cap at 100
  score = Math.min(score, 100);

  // Determine risk level
  let level: string;
  if (score < 25) level = 'Low Risk';
  else if (score < 50) level = 'Moderate Risk';
  else level = 'High Risk';

  // Generate recommendations
  const recommendations = generateRecommendations(score);

  return {
    score,
    level,
    factors,
    recommendations
  };
}

function generateRecommendations(score: number): string[] {
  if (score < 25) {
    return [
      'Maintain your healthy lifestyle',
      'Continue regular exercise (30 mins daily)',
      'Keep a balanced diet',
      'Regular health checkups (once a year)'
    ];
  }
  if (score < 50) {
    return [
      'Consider lifestyle modifications',
      'Increase physical activity',
      'Reduce salt and sugar intake',
      'Monitor blood pressure regularly',
      'Consult doctor for personalized advice'
    ];
  }
  return [
    'Immediate medical consultation recommended',
    'Comprehensive health assessment required',
    'Lifestyle changes are crucial',
    'Regular monitoring of vital signs',
    'Consider meeting a cardiologist'
  ];
}

export default router;