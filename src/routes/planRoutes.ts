import { Router } from 'express';
import { PlanController } from '../controllers/planController';

const router = Router();
const planController = new PlanController();

// Rotas para planos
router.get('/', planController.getAllPlans);
router.get('/:id', planController.getPlanById);
router.get('/category/:category', planController.getPlansByCategory);
router.get('/type/:type', planController.getPlansByType);

export default router;
