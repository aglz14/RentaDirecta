/*
  # Add plans and subscriptions tables

  1. New Tables
    - `plans`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `features` (text array)
      - `price` (numeric)
      - `billing_period` (text)
      - `active` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `subscriptions`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `plan_id` (uuid, references plans)
      - `status` (text)
      - `current_period_start` (timestamptz)
      - `current_period_end` (timestamptz)
      - `cancel_at_period_end` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
    - Add policies for subscription management

  3. Changes
    - Add foreign key relationships
    - Add indexes for performance
    - Add check constraints for data integrity
*/

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  features text[] NOT NULL DEFAULT '{}',
  price numeric NOT NULL CHECK (price >= 0),
  billing_period text NOT NULL CHECK (billing_period IN ('monthly', 'yearly')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id uuid REFERENCES plans(id) ON DELETE RESTRICT NOT NULL,
  status text NOT NULL CHECK (status IN ('active', 'canceled', 'incomplete', 'past_due')),
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(profile_id, plan_id)
);

-- Enable Row Level Security
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for plans table
CREATE POLICY "Anyone can view active plans"
  ON plans
  FOR SELECT
  USING (active = true);

CREATE POLICY "Only admins can modify plans"
  ON plans
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Create policies for subscriptions table
CREATE POLICY "Users can view their own subscriptions"
  ON subscriptions
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Users can manage their own subscriptions"
  ON subscriptions
  FOR ALL
  TO authenticated
  USING (profile_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_plans_active ON plans(active) WHERE active = true;
CREATE INDEX idx_plans_price ON plans(price);
CREATE INDEX idx_subscriptions_profile ON subscriptions(profile_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_dates ON subscriptions(current_period_start, current_period_end);

-- Add trigger for updated_at
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default plans
INSERT INTO plans (name, description, features, price, billing_period)
VALUES
  (
    'Plan Básico',
    'Ideal para propietarios que inician',
    ARRAY[
      'Hasta 5 propiedades',
      'Gestión básica de inquilinos',
      'Reportes mensuales',
      'Soporte por correo'
    ],
    499,
    'monthly'
  ),
  (
    'Plan Profesional',
    'Para propietarios con múltiples propiedades',
    ARRAY[
      'Hasta 15 propiedades',
      'Gestión avanzada de inquilinos',
      'Reportes semanales',
      'Soporte prioritario',
      'Análisis de mercado'
    ],
    999,
    'monthly'
  ),
  (
    'Plan Empresarial',
    'Solución completa para empresas inmobiliarias',
    ARRAY[
      'Propiedades ilimitadas',
      'Gestión completa de inquilinos',
      'Reportes en tiempo real',
      'Soporte 24/7',
      'Análisis avanzado de mercado',
      'API personalizada'
    ],
    1999,
    'monthly'
  );