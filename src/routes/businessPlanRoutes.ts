import express from 'express';
import { supabase } from '../config/database';

interface CustomPlanRequest {
  companyName: string;
  email: string;
  numberOfEmployees: number;
  totalPrice: number;
  selectedBenefits: string[];
}

const router = express.Router();

// Rota para enviar um novo plano customizado
router.post('/custom', async (req, res) => {
  const {
    companyName,
    email,
    numberOfEmployees,
    totalPrice,
    selectedBenefits,
  }: CustomPlanRequest = req.body;

  try {
    // Inserir o plano customizado
    const { data: customPlan, error: planError } = await supabase
      .from('custom_business_plans')
      .insert([
        {
          company_name: companyName,
          email,
          number_of_employees: numberOfEmployees,
          total_price: totalPrice,
          selected_benefits: selectedBenefits // Armazenar os IDs dos benefícios diretamente na tabela
        }
      ])
      .select()
      .single();

    if (planError) throw planError;

    res.status(201).json(customPlan);
  } catch (error) {
    console.error('Error creating custom plan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
