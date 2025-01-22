import express from 'express';
import cors from 'cors';
import partnerRoutes from './routes/partnerRoutes';
import businessPlanRoutes from './routes/businessPlanRoutes';
import adminRoutes from './routes/adminRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/partners', partnerRoutes);
app.use('/api/business-plans', businessPlanRoutes);
app.use('/api/admin', adminRoutes);

// Rota de teste para verificar se a API está funcionando
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
