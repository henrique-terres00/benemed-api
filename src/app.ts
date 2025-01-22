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

// Rotas de healthcheck (ambas para garantir compatibilidade)
const healthCheck = (_req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
};

app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

export default app;
