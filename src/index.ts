import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import partnerRoutes from './routes/partnerRoutes';
import adminRoutes from './routes/adminRoutes';
import businessPlanRoutes from './routes/businessPlanRoutes';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();

// Middleware
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
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
