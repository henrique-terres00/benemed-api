-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'customer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE subscription_status AS ENUM ('active', 'pending', 'cancelled', 'expired');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE plan_type AS ENUM ('individual', 'family');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('credit_card', 'debit', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Addresses table
CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    number VARCHAR(20) NOT NULL,
    complement VARCHAR(255),
    neighborhood VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(9) NOT NULL,
    is_main BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para garantir apenas um endereço principal
CREATE OR REPLACE FUNCTION ensure_single_main_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_main THEN
        UPDATE addresses 
        SET is_main = false 
        WHERE user_id = NEW.user_id 
        AND id != NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ensure_single_main_address_trigger ON addresses;
CREATE TRIGGER ensure_single_main_address_trigger
    BEFORE INSERT OR UPDATE ON addresses
    FOR EACH ROW
    EXECUTE FUNCTION ensure_single_main_address();

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type plan_type NOT NULL,
    category VARCHAR(50) NOT NULL,
    is_family BOOLEAN DEFAULT false,
    features JSONB NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES plans(id),
    status subscription_status DEFAULT 'pending',
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT false,
    canceled_at TIMESTAMP WITH TIME ZONE,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Dependents table
CREATE TABLE IF NOT EXISTS dependents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    birth_date DATE NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    payment_method payment_method NOT NULL,
    payment_details JSONB,
    external_id VARCHAR(255),
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Benefit usage table
CREATE TABLE IF NOT EXISTS benefit_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
    dependent_id UUID REFERENCES dependents(id) ON DELETE SET NULL,
    benefit_type VARCHAR(50) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    original_price DECIMAL(10,2) NOT NULL,
    discount DECIMAL(10,2) NOT NULL,
    final_price DECIMAL(10,2) NOT NULL,
    usage_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Partners table
CREATE TABLE IF NOT EXISTS partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(255) NOT NULL,
    state VARCHAR(2) NOT NULL,
    crm VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Trigger para atualizar o updated_at dos partners
CREATE TRIGGER IF NOT EXISTS update_partners_updated_at
    BEFORE UPDATE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER IF NOT EXISTS update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_plans_updated_at
    BEFORE UPDATE ON plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_cpf ON users(cpf);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_subscription_id ON transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_benefit_usage_subscription_id ON benefit_usage(subscription_id);

-- Initial data for plans
INSERT INTO plans (name, type, category, is_family, price, features) VALUES
('Bem-estar Individual', 'individual', 'Bem-estar', false, 29.90, 
    '{
        "orientacao_telemedicina": true,
        "descontos_medicamentos": true,
        "rede_fisica": false,
        "assistencia_residencial": false,
        "assistencia_pet": false,
        "check_up": false,
        "acidentes_pessoais": true,
        "assistencia_funeral": true
    }'::jsonb
),
('Bem-estar Familiar', 'family', 'Bem-estar', true, 49.90,
    '{
        "orientacao_telemedicina": true,
        "descontos_medicamentos": true,
        "rede_fisica": false,
        "assistencia_residencial": false,
        "assistencia_pet": false,
        "check_up": false,
        "acidentes_pessoais": true,
        "assistencia_funeral": true
    }'::jsonb
),
('Essencial Individual', 'individual', 'Essencial', false, 39.90,
    '{
        "orientacao_telemedicina": true,
        "descontos_medicamentos": true,
        "rede_fisica": true,
        "assistencia_residencial": true,
        "assistencia_pet": false,
        "check_up": false,
        "acidentes_pessoais": true,
        "assistencia_funeral": true
    }'::jsonb
),
('Essencial Familiar', 'family', 'Essencial', true, 69.90,
    '{
        "orientacao_telemedicina": true,
        "descontos_medicamentos": true,
        "rede_fisica": true,
        "assistencia_residencial": true,
        "assistencia_pet": false,
        "check_up": false,
        "acidentes_pessoais": true,
        "assistencia_funeral": true
    }'::jsonb
),
('Protege Individual', 'individual', 'Protege', false, 59.90,
    '{
        "orientacao_telemedicina": true,
        "descontos_medicamentos": true,
        "rede_fisica": true,
        "assistencia_residencial": true,
        "assistencia_pet": true,
        "check_up": false,
        "acidentes_pessoais": true,
        "assistencia_funeral": true
    }'::jsonb
),
('Protege Familiar', 'family', 'Protege', true, 99.90,
    '{
        "orientacao_telemedicina": true,
        "descontos_medicamentos": true,
        "rede_fisica": true,
        "assistencia_residencial": true,
        "assistencia_pet": true,
        "check_up": false,
        "acidentes_pessoais": true,
        "assistencia_funeral": true
    }'::jsonb
),
('Premium Individual', 'individual', 'Premium', false, 89.90,
    '{
        "orientacao_telemedicina": true,
        "descontos_medicamentos": true,
        "rede_fisica": true,
        "assistencia_residencial": true,
        "assistencia_pet": true,
        "check_up": true,
        "acidentes_pessoais": true,
        "assistencia_funeral": true
    }'::jsonb
),
('Premium Familiar', 'family', 'Premium', true, 149.90,
    '{
        "orientacao_telemedicina": true,
        "descontos_medicamentos": true,
        "rede_fisica": true,
        "assistencia_residencial": true,
        "assistencia_pet": true,
        "check_up": true,
        "acidentes_pessoais": true,
        "assistencia_funeral": true
    }'::jsonb
);
