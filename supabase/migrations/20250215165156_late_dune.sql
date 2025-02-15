-- Add last_payment_date column to tenants table
ALTER TABLE tenants
ADD COLUMN IF NOT EXISTS last_payment_date timestamptz;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tenants_last_payment_date
ON tenants(last_payment_date DESC);

-- Add constraint to ensure last_payment_date is not in the future
ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS tenants_last_payment_date_check;

ALTER TABLE tenants
ADD CONSTRAINT tenants_last_payment_date_check
CHECK (last_payment_date IS NULL OR last_payment_date <= CURRENT_TIMESTAMP);

-- Add trigger to update last_payment_date when a payment is completed
CREATE OR REPLACE FUNCTION update_tenant_last_payment_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE tenants
    SET last_payment_date = NEW.date
    WHERE id = NEW.tenant_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tenant_payment_date ON payments;

CREATE TRIGGER update_tenant_payment_date
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_tenant_last_payment_date();