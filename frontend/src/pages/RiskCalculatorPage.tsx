import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Activity, Calculator, AlertCircle, CheckCircle, ArrowRight, RefreshCw } from 'lucide-react';

interface RiskForm {
  age: string;
  bmi: string;
  bloodPressure: string;
  diabetes: string;
  smoking: string;
  familyHistory: string;
}

export default function RiskCalculatorPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState<RiskForm>({
    age: '',
    bmi: '',
    bloodPressure: 'normal',
    diabetes: 'no',
    smoking: 'no',
    familyHistory: 'no'
  });
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (field: keyof RiskForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setRiskScore(null);
  };

  const calculateRisk = async () => {
    setIsCalculating(true);
    
    // Simulate calculation
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Validate inputs
    const age = parseInt(form.age);
    const bmi = parseFloat(form.bmi);
    
    if (isNaN(age) || isNaN(bmi) || age <= 0 || bmi <= 0) {
      setIsCalculating(false);
      return;
    }

    // Calculate risk score based on factors
    let score = 0;
    
    // Age factor
    if (age >= 60) score += 25;
    else if (age >= 45) score += 15;
    else if (age >= 30) score += 5;

    // BMI factor
    if (bmi >= 30) score += 25;
    else if (bmi >= 25) score += 15;
    else if (bmi >= 18.5) score += 0;
    else score += 5;

    // Blood pressure factor
    if (form.bloodPressure === 'high') score += 20;
    else if (form.bloodPressure === 'elevated') score += 10;

    // Diabetes factor
    if (form.diabetes === 'yes') score += 20;
    else if (form.diabetes === 'pre') score += 10;

    // Smoking factor
    if (form.smoking === 'yes') score += 15;

    // Family history factor
    if (form.familyHistory === 'yes') score += 15;

    // Cap at 100
    setRiskScore(Math.min(score, 100));
    setIsCalculating(false);
  };

  const getRiskLevel = (score: number): { level: string; color: string; bg: string } => {
    if (score < 25) return { level: t('risk.low'), color: 'text-green-500', bg: 'bg-green-500' };
    if (score < 50) return { level: t('risk.moderate'), color: 'text-yellow-500', bg: 'bg-yellow-500' };
    return { level: t('risk.high'), color: 'text-red-500', bg: 'bg-red-500' };
  };

  const getRecommendations = (score: number): string[] => {
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
  };

  const riskLevel = riskScore !== null ? getRiskLevel(riskScore) : null;

  return (
    <section id="risk" className="min-h-screen pt-16 py-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Activity className="w-4 h-4" />
            Health Assessment
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('risk.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t('risk.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="bg-card rounded-2xl border border-border p-6 animate-fade-in-up stagger-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calculator className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Your Information</h2>
            </div>

            <div className="space-y-4">
              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('risk.age')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={form.age}
                  onChange={(e) => handleChange('age', e.target.value)}
                  placeholder="Enter your age"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* BMI */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('risk.bmi')}
                </label>
                <input
                  type="number"
                  min="10"
                  max="60"
                  step="0.1"
                  value={form.bmi}
                  onChange={(e) => handleChange('bmi', e.target.value)}
                  placeholder="e.g., 24.5"
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Blood Pressure */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('risk.bloodPressure')}
                </label>
                <select
                  value={form.bloodPressure}
                  onChange={(e) => handleChange('bloodPressure', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="normal">Normal (Below 120/80)</option>
                  <option value="elevated">Elevated (120-129/Below 80)</option>
                  <option value="high">High (130+/80+)</option>
                </select>
              </div>

              {/* Diabetes */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('risk.diabetes')}
                </label>
                <select
                  value={form.diabetes}
                  onChange={(e) => handleChange('diabetes', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="no">{t('risk.no')}</option>
                  <option value="pre">Pre-diabetic</option>
                  <option value="yes">{t('risk.yes')}</option>
                </select>
              </div>

              {/* Smoking */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('risk.smoking')}
                </label>
                <select
                  value={form.smoking}
                  onChange={(e) => handleChange('smoking', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="no">{t('risk.no')}</option>
                  <option value="yes">{t('risk.yes')}</option>
                </select>
              </div>

              {/* Family History */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('risk.familyHistory')}
                </label>
                <select
                  value={form.familyHistory}
                  onChange={(e) => handleChange('familyHistory', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="no">{t('risk.no')}</option>
                  <option value="yes">{t('risk.yes')}</option>
                </select>
              </div>

              {/* Calculate Button */}
              <button
                onClick={calculateRisk}
                disabled={isCalculating || !form.age.trim() || !form.bmi.trim() || isNaN(parseFloat(form.bmi)) || isNaN(parseInt(form.age)) || parseFloat(form.bmi) <= 0 || parseInt(form.age) <= 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02]"
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    {t('risk.calculate')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="animate-fade-in-up stagger-2">
            {riskScore !== null ? (
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
                <div className="text-center mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-6">{t('risk.yourRisk')}</h2>
                  
                  {/* Gauge */}
                  <div className="relative w-48 h-24 mx-auto mb-4">
                    {/* Background arc */}
                    <svg viewBox="0 0 200 100" className="w-full h-full">
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="16"
                        className="text-muted/30"
                      />
                      {/* Score arc */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray={`${(riskScore / 100) * 251.3} 251.3`}
                        className={riskLevel?.color}
                      />
                    </svg>
                    
                    {/* Score text */}
                    <div className="absolute inset-0 flex items-end justify-center pb-2">
                      <span className={`text-5xl font-bold ${riskLevel?.color}`}>
                        {riskScore}
                      </span>
                      <span className="text-lg text-muted-foreground mb-4">%</span>
                    </div>
                  </div>

                  {/* Risk Level */}
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${riskLevel?.bg}/10`}>
                    {riskScore < 50 ? (
                      <CheckCircle className={`w-4 h-4 ${riskLevel?.color}`} />
                    ) : (
                      <AlertCircle className={`w-4 h-4 ${riskLevel?.color}`} />
                    )}
                    <span className={`font-medium ${riskLevel?.color}`}>{riskLevel?.level}</span>
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h3 className="font-semibold text-foreground mb-4">{t('risk.recommendations')}</h3>
                  <div className="space-y-3">
                    {getRecommendations(riskScore).map((rec, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                      >
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-foreground">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-xs text-yellow-700 dark:text-yellow-400">
                    This is an automated risk assessment based on the information provided. 
                    Please consult a healthcare professional for accurate medical advice.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border p-12 text-center sticky top-24">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                  <Activity className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Calculate Your Risk
                </h3>
                <p className="text-muted-foreground">
                  Fill in your details and click calculate to see your health risk assessment
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
