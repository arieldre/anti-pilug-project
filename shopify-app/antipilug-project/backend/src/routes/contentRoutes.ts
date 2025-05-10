import express from 'express';
import { getContent, updateContent, getRecommendedContent } from '../controllers/contentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Important: More specific routes should come before parameter routes
router.get('/recommended', protect, getRecommendedContent);
router.get('/:page', protect, getContent);
router.put('/:page', protect, updateContent);

export default router; 