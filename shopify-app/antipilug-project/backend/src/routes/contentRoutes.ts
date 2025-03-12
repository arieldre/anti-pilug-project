import express from 'express';
import * as contentController from '../controllers/contentController';

const router = express.Router();

// GET /api/content - Get all content with filters
router.get('/', contentController.getContent);

// GET /api/content/featured - Get featured content
router.get('/featured', contentController.getFeaturedContent);

// GET /api/content/:id - Get content by ID
router.get('/:id', contentController.getContentById);

export default router;