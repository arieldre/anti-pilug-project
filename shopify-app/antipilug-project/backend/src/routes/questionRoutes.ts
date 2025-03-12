import express from 'express';
import * as questionController from '../controllers/questionController';
import { protect } from '../middleware/authMiddleware'

const router = express.Router();

// GET /api/questions - Get all questions, optionally filtered by type
router.get('/', questionController.getQuestions);

// GET /api/questions/user-answers - Get user's question answers (protected)
router.get('/user-answers', protect, questionController.getUserAnswers);

// POST /api/questions/user-answers - Save user's question answers (protected)
router.post('/user-answers', protect, questionController.saveUserAnswers);

export default router;