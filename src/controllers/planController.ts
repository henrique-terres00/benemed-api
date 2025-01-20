import { Request, Response } from 'express';
import { PlanService } from '../services/planService';

const planService = new PlanService();

export class PlanController {
  async getAllPlans(req: Request, res: Response) {
    try {
      console.log('Fetching all plans...');
      const plans = await planService.getAllPlans();
      console.log('Plans fetched successfully:', plans?.length || 0, 'plans found');
      res.json(plans);
    } catch (error) {
      console.error('Error fetching plans:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPlanById(req: Request, res: Response) {
    try {
      console.log('Fetching plan by id...');
      const { id } = req.params;
      const plan = await planService.getPlanById(id);
      
      if (!plan) {
        console.log('Plan not found:', id);
        return res.status(404).json({ error: 'Plan not found' });
      }

      console.log('Plan fetched successfully:', plan);
      res.json(plan);
    } catch (error) {
      console.error('Error fetching plan:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPlansByCategory(req: Request, res: Response) {
    try {
      console.log('Fetching plans by category...');
      const { category } = req.params;
      const plans = await planService.getPlansByCategory(category);
      console.log('Plans fetched successfully:', plans?.length || 0, 'plans found');
      res.json(plans);
    } catch (error) {
      console.error('Error fetching plans by category:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getPlansByType(req: Request, res: Response) {
    try {
      console.log('Fetching plans by type...');
      const { type } = req.params;
      if (type !== 'individual' && type !== 'family') {
        console.log('Invalid plan type:', type);
        return res.status(400).json({ error: 'Invalid plan type' });
      }
      
      const plans = await planService.getPlansByType(type);
      console.log('Plans fetched successfully:', plans?.length || 0, 'plans found');
      res.json(plans);
    } catch (error) {
      console.error('Error fetching plans by type:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
