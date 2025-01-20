import { Request, Response } from 'express';
import { PlanService } from '../services/planService';

const planService = new PlanService();

export class PlanController {
  async getAllPlans(req: Request, res: Response) {
    try {
      const plans = await planService.getAllPlans();
      res.json(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPlanById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const plan = await planService.getPlanById(id);
      
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      res.json(plan);
    } catch (error) {
      console.error('Error fetching plan:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPlansByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const plans = await planService.getPlansByCategory(category);
      res.json(plans);
    } catch (error) {
      console.error('Error fetching plans by category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPlansByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      if (type !== 'individual' && type !== 'family') {
        return res.status(400).json({ error: 'Invalid plan type' });
      }
      
      const plans = await planService.getPlansByType(type);
      res.json(plans);
    } catch (error) {
      console.error('Error fetching plans by type:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
