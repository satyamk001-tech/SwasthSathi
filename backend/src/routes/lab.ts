import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and image files are allowed'));
    }
  }
});

// Upload and analyze lab report
router.post('/analyze', upload.single('report'), [
  body('patientInfo').optional().isObject(),
  body('notes').optional().isString().isLength({ max: 500 })
], async (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Mock analysis (replace with actual AI/ML processing)
    const analysis = await analyzeLabReport(req.file);

    res.json({
      analysis,
      filename: req.file.originalname,
      uploadedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Lab analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze lab report' });
  }
});

// Mock lab report analysis (replace with actual AI service)
async function analyzeLabReport(file: Express.Multer.File) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Mock analysis results
  return {
    summary: 'Your lab report appears normal with no critical abnormalities detected.',
    parameters: [
      {
        name: 'Hemoglobin',
        value: '14.2 g/dL',
        range: '12.0-16.0 g/dL',
        status: 'normal',
        interpretation: 'Normal hemoglobin level'
      },
      {
        name: 'Blood Sugar (Fasting)',
        value: '95 mg/dL',
        range: '70-100 mg/dL',
        status: 'normal',
        interpretation: 'Normal fasting blood sugar'
      },
      {
        name: 'Total Cholesterol',
        value: '180 mg/dL',
        range: '< 200 mg/dL',
        status: 'normal',
        interpretation: 'Desirable cholesterol level'
      }
    ],
    recommendations: [
      'Continue your current healthy lifestyle',
      'Regular exercise is beneficial',
      'Maintain balanced diet',
      'Next checkup in 6 months'
    ],
    doctorConsultation: false
  };
}

// Get analysis history
router.get('/history', (req: express.Request, res: express.Response) => {
  // Mock history (replace with database query)
  const history = [
    {
      id: 1,
      date: '2024-01-15',
      filename: 'blood_test_jan.pdf',
      summary: 'Normal blood count',
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-02-10',
      filename: 'lipid_profile.pdf',
      summary: 'Cholesterol levels normal',
      status: 'completed'
    }
  ];

  res.json({ history });
});

export default router;