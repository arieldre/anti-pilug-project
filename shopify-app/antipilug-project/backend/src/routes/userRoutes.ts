import express from 'express';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// POST /api/users - Register a new user
router.post('/', userController.registerUser);

// GET /api/users/profile - Get user profile (protected)
router.get('/profile', protect, userController.getUserProfile);

// PUT /api/users/questionnaire-changes - Update user's questionnaire changes (protected)
router.put('/questionnaire-changes', protect, userController.updateQuestionnaireChanges);

export default router;