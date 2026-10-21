import express from 'express';
import cors from 'cors';
import aiRouter from './routes/ai';
import labRouter from './routes/lab';
import hospitalsRouter from './routes/hospitals';
import riskRouter from './routes/risk';
import authRouter from './routes/auth';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Primary API Routes
app.use('/api/ai', aiRouter);
app.use('/api/lab', labRouter);
app.use('/api/hospitals', hospitalsRouter);
app.use('/api/risk', riskRouter);
app.use('/api/auth', authRouter);

// 🔥 SWASTHSATHI Backward Compatibility Endpoints
app.post('/swasthsathi/predict-diabetes', (req, res) => {
  const { age = 45, glucose = 120, bp = 80 } = req.body;
  const risk = Math.min(95, (Number(age) * 0.5) + (Number(glucose) / 3) + (Number(bp) / 5));

  res.json({
    risk: Math.round(risk),
    message: risk > 70 ? 'HIGH RISK - Endocrinologist Consultation Recommended' : 'Low to moderate risk',
    tips: ['Walk 30min daily', 'Reduce refined sugars', 'Monitor BP monthly']
  });
});

app.post('/swasthsathi/analyze-lab', (req, res) => {
  const { text = '' } = req.body;
  const lower = String(text).toLowerCase();
  const flags: string[] = [];

  if (lower.includes('hba1c') && (lower.includes('7') || lower.includes('8') || lower.includes('9'))) {
    flags.push('DIABETES / ELEVATED HBA1C RISK');
  }
  if (lower.includes('ldl') && (lower.includes('160') || lower.includes('180') || lower.includes('200'))) {
    flags.push('ELEVATED LDL CHOLESTEROL / HEART RISK');
  }

  res.json({
    flags,
    severity: flags.length > 1 ? 'RED' : flags.length ? 'YELLOW' : 'GREEN',
    next_steps: flags.length ? 'Visit physician or specialist' : 'All parameters normal'
  });
});

app.get('/swasthsathi/hospitals', (req, res) => {
  res.json([
    { name: 'AIIMS Delhi', rating: 4.8, distance: '2.1km', erBeds: 18, cashless: true },
    { name: 'Safdarjung Hospital', rating: 4.2, distance: '4.5km', erBeds: 12, cashless: true },
    { name: 'RML Hospital', rating: 4.0, distance: '6.2km', erBeds: 8, cashless: true }
  ]);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    app: 'SwasthSathi Backend',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SwasthSathi Backend running on port ${PORT}`);
  console.log(`📡 AI Service: http://localhost:${PORT}/api/ai`);
  console.log(`🔬 Lab Analyzer: http://localhost:${PORT}/api/lab`);
  console.log(`🏥 Hospitals: http://localhost:${PORT}/api/hospitals`);
  console.log(`📊 Risk Calculator: http://localhost:${PORT}/api/risk`);
  console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
