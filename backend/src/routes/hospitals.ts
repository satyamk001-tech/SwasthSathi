import express from 'express';
import { body, param, query, validationResult } from 'express-validator';

const router = express.Router();

// Mock hospital data (replace with database)
const hospitals = [
  {
    id: 1,
    name: 'AIIMS Delhi',
    address: 'Ansari Nagar, New Delhi',
    phone: '+91-11-26588500',
    rating: 4.8,
    distance: 2.5,
    specialties: ['Cardiology', 'Neurology', 'Oncology'],
    emergency: true,
    cashless: true,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=400'
  },
  {
    id: 2,
    name: 'Safdarjung Hospital',
    address: 'Ansari Nagar, New Delhi',
    phone: '+91-11-26707444',
    rating: 4.6,
    distance: 3.2,
    specialties: ['Emergency', 'Surgery', 'Medicine'],
    emergency: true,
    cashless: true,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
  },
  {
    id: 3,
    name: 'Apollo Hospital Delhi',
    address: 'Sarita Vihar, New Delhi',
    phone: '+91-11-26925858',
    rating: 4.7,
    distance: 8.5,
    specialties: ['Cardiology', 'Orthopedics', 'Neurology'],
    emergency: true,
    cashless: true,
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400'
  }
];

// Get all hospitals
router.get('/', [
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be >= 0')
], (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const paginatedHospitals = hospitals.slice(offset, offset + limit);

    res.json({
      hospitals: paginatedHospitals,
      total: hospitals.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('Get hospitals error:', error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
});

// Get hospital by ID
router.get('/:id', [
  param('id').isInt({ min: 1 }).withMessage('Hospital ID must be a positive integer')
], (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const id = parseInt(req.params.id as string);
    const hospital = hospitals.find(h => h.id === id);

    if (!hospital) {
      return res.status(404).json({ error: 'Hospital not found' });
    }

    res.json(hospital);
  } catch (error) {
    console.error('Get hospital error:', error);
    res.status(500).json({ error: 'Failed to fetch hospital' });
  }
});

// Search hospitals
router.get('/search/:query', [
  param('query').isString().isLength({ min: 1, max: 100 }).withMessage('Search query must be 1-100 characters')
], (req: express.Request, res: express.Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const query = (req.params.query as string).toLowerCase();
    const results = hospitals.filter(hospital =>
      hospital.name.toLowerCase().includes(query) ||
      hospital.address.toLowerCase().includes(query) ||
      hospital.specialties.some(specialty => specialty.toLowerCase().includes(query))
    );

    res.json({
      results,
      query,
      count: results.length
    });
  } catch (error) {
    console.error('Search hospitals error:', error);
    res.status(500).json({ error: 'Failed to search hospitals' });
  }
});

export default router;