import express from 'express';
import { getQuestions, submitAnswers } from '../controllers/questionController';
import { protect } from '../middleware/authMiddleware'

const router = express.Router();

// GET /api/questions - Get all questions, optionally filtered by type
router.get('/', getQuestions);

// GET /api/questions/user-answers - Get user's question answers (protected)
router.get('/user-answers', protect, getQuestions);

// POST /api/questions/user-answers - Save user's question answers (protected)
router.post('/user-answers', protect, submitAnswers);

// POST /api/questions/submit - Submit answers to questions
router.post('/submit', submitAnswers);

export default router;