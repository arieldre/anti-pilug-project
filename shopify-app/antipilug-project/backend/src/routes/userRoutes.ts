import express from 'express';
import { getProfile, updateProfile, createUser } from '../controllers/userController';

const router = express.Router();

// POST /api/users - Register a new user
router.post('/', createUser);

// GET /api/users/profile - Get user profile (protected)
router.get('/:id', getProfile);

// PUT /api/users/questionnaire-changes - Update user's questionnaire changes (protected)
router.put('/:id', updateProfile);

export default router;