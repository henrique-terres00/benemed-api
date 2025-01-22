import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import partnerRoutes from './routes/partnerRoutes';
import businessPlanRoutes from './routes/businessPlanRoutes';
import adminRoutes from './routes/adminRoutes';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());

// Rotas
app.use('/api/business-plans', businessPlanRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/admin', adminRoutes);

// Rota de healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

export default app;
