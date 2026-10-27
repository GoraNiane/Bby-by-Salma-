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

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));
const frontendUploadsDir = path.join(__dirname, '../frontend/public/uploads');
if (fs.existsSync(frontendUploadsDir)) {
  app.use('/uploads', express.static(frontendUploadsDir));
}

// Initialize DB
db.init();

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/customers', customersRouter);
app.use('/api/sales', salesRouter);
app.use('/api/dashboard', salesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/content', contentRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/upload', uploadRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', store: 'BBS By Salma API', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`[BBS Server] API Server running successfully on http://localhost:${PORT}`);
});
