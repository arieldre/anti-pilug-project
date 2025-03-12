import express from 'express';
import { productController } from '../controllers/productController';

const router = express.Router();

router.get('/', productController.getProducts);
router.post('/:productId/check-plagiarism', productController.checkPlagiarism);

export default router;