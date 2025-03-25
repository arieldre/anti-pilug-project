import express from 'express';
import { getContent, updateContent } from '../controllers/contentController';

const router = express.Router();

router.get('/:page', getContent);
router.put('/:page', updateContent);

export default router; 