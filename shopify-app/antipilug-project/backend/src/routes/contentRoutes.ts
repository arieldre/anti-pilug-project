import express from 'express';
import { getContent, updateContent, getRecommendedContent } from '../controllers/contentController';

const router = express.Router();

// Important: More specific routes should come before parameter routes
router.get('/recommended', getRecommendedContent);
router.get('/:page', getContent);
router.put('/:page', updateContent);

export default router; 