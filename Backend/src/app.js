import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import chatRoutes from './routes/chat.routes.js';
import tenantRoutes from './routes/tenant.routes.js';
import voiceRoutes from './routes/voice.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import knowledgeBaseRoutes from './routes/knowledgeBase.routes.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsMiddleware = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Tenant-Id, X-Session-Id, X-Customer-Name');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
};

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static assets from Backend/public
app.use('/public', express.static(path.join(__dirname, '..', 'public')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/voice', voiceRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/knowledge', knowledgeBaseRoutes);

// --- PRODUCTION SERVING ---
const frontendDistPath = path.resolve(__dirname, '..', '..', 'Frontend', 'dist');

// Serve Frontend static files
app.use(express.static(frontendDistPath));

// Catch-all for SPA: Serve index.html for any non-API GET route
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();

  res.sendFile(path.join(frontendDistPath, 'index.html'), (err) => {
    if (err) {
      // Fallback for debugging if build folder is missing
      res.status(404).send('Frontend build not found. Please run "npm run build" in the Frontend directory.');
    }
  });
});

connectDB();

export default app;
