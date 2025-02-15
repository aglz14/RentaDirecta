-- Add payment_scheme column to tenants table
ALTER TABLE tenants
ADD COLUMN IF NOT EXISTS payment_scheme text NOT NULL DEFAULT 'flex'
CHECK (payment_scheme IN ('subscription', 'flex'));

-- Remove the default after adding the column
ALTER TABLE tenants
ALTER COLUMN payment_scheme DROP DEFAULT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tenants_payment_scheme
ON tenants(payment_scheme);

-- Add constraint to ensure valid payment schemes
ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS tenants_payment_scheme_check;

ALTER TABLE tenants
ADD CONSTRAINT tenants_payment_scheme_check
CHECK (payment_scheme IN ('subscription', 'flex'));