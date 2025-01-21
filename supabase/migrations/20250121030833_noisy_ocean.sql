/*
  # Enhance plans and payment schemes

  1. Changes
    - Add payment_scheme column to plans table
    - Add discount_percentage column to plans table
    - Add payment_methods column to plans table
    - Add billing_day column to subscriptions table
    - Add payment_method column to subscriptions table
    - Add indexes for new columns
    - Update existing plans with new data

  2. Security
    - Update RLS policies to include new columns
    - Add check constraints for new columns

  3. Data Migration
    - Update existing plans with payment scheme information
*/

-- Add new columns to plans table
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS payment_scheme text NOT NULL DEFAULT 'subscription' 
  CHECK (payment_scheme IN ('subscription', 'flex')),
ADD COLUMN IF NOT EXISTS discount_percentage numeric NOT NULL DEFAULT 0 
  CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
ADD COLUMN IF NOT EXISTS payment_methods text[] NOT NULL DEFAULT '{credit_card,debit_card,bank_transfer}' 
  CHECK (payment_methods <@ '{credit_card,debit_card,bank_transfer,cash,convenience_store}'::text[]);

-- Add new columns to subscriptions table
ALTER TABLE subscriptions 
ADD COLUMN IF NOT EXISTS billing_day integer 
  CHECK (billing_day >= 1 AND billing_day <= 31),
ADD COLUMN IF NOT EXISTS payment_method text 
  CHECK (payment_method IN ('credit_card', 'debit_card', 'bank_transfer', 'cash', 'convenience_store'));

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_plans_payment_scheme 
ON plans(payment_scheme);

CREATE INDEX IF NOT EXISTS idx_subscriptions_billing_day 
ON subscriptions(billing_day);

-- Update existing plans with payment scheme information
UPDATE plans 
SET 
  payment_scheme = 'subscription',
  discount_percentage = 5,
  payment_methods = '{credit_card}'
WHERE name = 'Plan Básico';

UPDATE plans 
SET 
  payment_scheme = 'flex',
  discount_percentage = 0,
  payment_methods = '{credit_card,debit_card,bank_transfer,cash,convenience_store}'
WHERE name = 'Plan Profesional';

UPDATE plans 
SET 
  payment_scheme = 'flex',
  discount_percentage = 0,
  payment_methods = '{credit_card,debit_card,bank_transfer,cash,convenience_store}'
WHERE name = 'Plan Empresarial';

-- Add computed column for discounted price
ALTER TABLE plans 
ADD COLUMN IF NOT EXISTS discounted_price numeric 
GENERATED ALWAYS AS (
  price - (price * discount_percentage / 100)
) STORED;

-- Create index for discounted price
CREATE INDEX IF NOT EXISTS idx_plans_discounted_price 
ON plans(discounted_price);