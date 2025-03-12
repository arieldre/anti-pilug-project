import express from 'express';
import productRoutes from './routes/productRoutes';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { corsMiddleware } from './middleware/cors';

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(corsMiddleware);
app.use(requestLogger);

// Routes
app.use('/api/products', productRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling middleware (should be last)
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});