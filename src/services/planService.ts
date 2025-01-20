import { supabase } from '../config/database';

export interface Plan {
  id: string;
  name: string;
  category: 'Bem-estar' | 'Essencial' | 'Protege' | 'Premium';
  is_family: boolean;
  price: number;
  features: {
    orientacao_telemedicina: boolean;
    descontos_medicamentos: boolean;
    rede_fisica: boolean;
    assistencia_residencial: boolean;
    assistencia_pet: boolean;
    check_up: boolean;
    acidentes_pessoais: boolean;
    assistencia_funeral: boolean;
  };
}

export class PlanService {
  async getAllPlans(): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('plans')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async getPlanById(id: string): Promise<Plan | null> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getPlansByCategory(category: string): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('category', category);

    if (error) throw error;
    return data || [];
  }

  async getPlansByType(type: 'individual' | 'family'): Promise<Plan[]> {
    const { data, error } = await supabase
      .from('plans')
      .select('*')
      .eq('is_family', type === 'family');

    if (error) throw error;
    return data || [];
  }
}
