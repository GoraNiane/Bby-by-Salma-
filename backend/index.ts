import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { db } from './db.js';
import { authRouter } from './routes/auth.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { collectionsRouter } from './routes/collections.routes.js';
import { categoriesRouter } from './routes/categories.routes.js';
import { ordersRouter } from './routes/orders.routes.js';
import { customersRouter } from './routes/customers.routes.js';
import { salesRouter } from './routes/sales.routes.js';
import { reviewsRouter } from './routes/reviews.routes.js';
import { contentRouter } from './routes/content.routes.js';
import { settingsRouter } from './routes/settings.routes.js';
import { uploadRouter } from './routes/upload.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure uploads folder exists
const uploadsDir = process.env.VERCEL
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');

try {
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
} catch (e) {
  console.warn('[BBS Server] Note: uploadsDir could not be created:', e);
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));
const frontendUploadsDir = path.join(__dirname, '../frontend/public/uploads');
if (fs.existsSync(frontendUploadsDir)) {
  app.use('/uploads', express.static(frontendUploadsDir));
}

// Initialize DB with seed data if needed
db.init();

// API Router (mount on both /api and / for seamless Vercel serverless routing)
const apiRouter = express.Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/collections', collectionsRouter);
apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/orders', ordersRouter);
apiRouter.use('/customers', customersRouter);
apiRouter.use('/sales', salesRouter);
apiRouter.use('/dashboard', salesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/content', contentRouter);
apiRouter.use('/settings', settingsRouter);
apiRouter.use('/upload', uploadRouter);
apiRouter.get('/health', (_req, res) => {
  res.json({ status: 'ok', store: 'BBS By Salma API', timestamp: new Date().toISOString() });
});
apiRouter.get('/', (_req, res) => {
  res.json({ status: 'ok', store: 'BBS By Salma API', timestamp: new Date().toISOString() });
});

// Mount on both /api and /
app.use('/api', apiRouter);
app.use('/', apiRouter);

// 404 handler so requests never hang
app.use((req, res) => {
  res.status(404).json({ error: `Route introuvable: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[BBS Uncaught Error]:', err);
  res.status(500).json({ error: err?.message || 'Erreur interne du serveur' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[BBS Server] API Server running on port ${PORT}`);
  });
}

export default app;
export { app };
