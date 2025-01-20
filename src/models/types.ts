export type UserRole = 'admin' | 'customer';
export type SubscriptionStatus = 'active' | 'pending' | 'cancelled' | 'expired';
export type PlanType = 'individual' | 'family';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit' | 'bank_transfer';

export interface User {
  id: string;
  full_name: string;
  email: string;
  cpf: string;
  phone: string;
  role: UserRole;
  created_at: Date;
  updated_at: Date;
}

export interface Address {
  id: string;
  user_id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_main: boolean;
  created_at: Date;
}

export interface Plan {
  id: string;
  name: string;
  type: PlanType;
  category: string;
  is_family: boolean;
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
  price: number;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: SubscriptionStatus;
  start_date?: Date;
  end_date?: Date;
  current_period_start?: Date;
  current_period_end?: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export interface Dependent {
  id: string;
  subscription_id: string;
  name: string;
  cpf: string;
  birth_date: Date;
  relationship: string;
  created_at: Date;
}

export interface Transaction {
  id: string;
  subscription_id: string;
  amount: number;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  payment_details: any;
  external_id?: string;
  transaction_date: Date;
  created_at: Date;
}

export interface BenefitUsage {
  id: string;
  subscription_id: string;
  dependent_id?: string;
  benefit_type: string;
  provider: string;
  original_price: number;
  discount: number;
  final_price: number;
  usage_date: Date;
  created_at: Date;
}
