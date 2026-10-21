import React, { useState, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Upload, FileText, AlertCircle, CheckCircle, Download, RefreshCw, Sparkles, X } from 'lucide-react';

interface AnalysisResult {
  reportType: string;
  findings: string[];
  recommendations: string[];
  summary: string;
  severity: 'normal' | 'attention' | 'critical';
}

export default function LabScannerPage() {
  const { t } = useLanguage();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);

    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock analysis result
    const mockResult: AnalysisResult = {
      reportType: 'Blood Test Report',
      findings: [
        'Hemoglobin level: 14.2 g/dL (Normal)',
        'WBC Count: 7,500 cells/mcL (Normal)',
        'Platelet Count: 250,000/mcL (Normal)',
        'Blood Glucose (Fasting): 118 mg/dL (Slightly Elevated)',
        'Cholesterol Total: 210 mg/dL (Borderline)',
        'Vitamin D: 25 ng/mL (Deficient)',
      ],
      recommendations: [
        'Maintain a healthy diet with reduced sugar intake',
        'Consider vitamin D supplementation after consulting doctor',
        'Regular exercise (30 minutes daily)',
        'Follow up with your healthcare provider in 3 months',
        'Monitor blood glucose levels regularly',
      ],
      summary: 'Overall, your blood test results show mostly normal values with a few areas that need attention. Your blood glucose and cholesterol are slightly elevated, and vitamin D is deficient. These are manageable with lifestyle modifications.',
      severity: 'attention'
    };

    setResult(mockResult);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setResult(null);
  };

  return (
    <section id="lab" className="min-h-screen pt-16 py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Analysis
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('lab.title')}
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your lab report and get instant AI-powered analysis with personalized recommendations
          </p>
        </div>

        {!result ? (
          <>
            {/* Upload Area */}
            <div 
              className="animate-fade-in-up stagger-1"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {previewUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
                  <img
                    src={previewUrl}
                    alt="Lab report preview"
                    className="w-full max-h-96 object-contain bg-muted"
                  />
                  <button
                    onClick={handleReset}
                    className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <Upload className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {t('lab.upload')}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t('lab.dropzone')}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">JPG</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">PNG</span>
                    <span className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground">PDF</span>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
            </div>

            {/* Analyze Button */}
            {previewUrl && (
              <div className="mt-6 text-center animate-fade-in-up stagger-2">
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      {t('lab.analyzing')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze Report
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Features */}
            <div className="mt-16 grid sm:grid-cols-3 gap-6 animate-fade-in-up stagger-3">
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Multiple Reports</h3>
                <p className="text-sm text-muted-foreground">Blood test, urine test, thyroid, and more</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Instant Results</h3>
                <p className="text-sm text-muted-foreground">Get analysis in seconds, not days</p>
              </div>
              <div className="text-center p-6">
                <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">AI Recommendations</h3>
                <p className="text-sm text-muted-foreground">Personalized health suggestions</p>
              </div>
            </div>
          </>
        ) : (
          /* Results */
          <div className="space-y-6 animate-fade-in-up">
            {/* Summary Card */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  result.severity === 'normal' ? 'bg-green-500/10' :
                  result.severity === 'attention' ? 'bg-yellow-500/10' : 'bg-red-500/10'
                }`}>
                  {result.severity === 'normal' ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : result.severity === 'attention' ? (
                    <AlertCircle className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">{t('lab.results')}</h2>
                  <p className="text-muted-foreground">{result.summary}</p>
                </div>
              </div>
            </div>

            {/* Findings */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Key Findings</h3>
              <div className="space-y-3">
                {result.findings.map((finding, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                  >
                    {finding.includes('Normal') ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    ) : finding.includes('Slightly') || finding.includes('Borderline') || finding.includes('Deficient') ? (
                      <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                    )}
                    <span className="text-sm text-foreground">{finding}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">{t('risk.recommendations')}</h3>
              <div className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-sm text-foreground">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors">
                <Download className="w-4 h-4" />
                {t('lab.download')}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-border text-foreground rounded-xl font-medium hover:bg-muted transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                {t('lab.scanAgain')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
