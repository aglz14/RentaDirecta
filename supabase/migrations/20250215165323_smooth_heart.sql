-- Drop existing constraints and columns to ensure clean slate
ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS tenants_profile_id_fkey,
DROP CONSTRAINT IF EXISTS tenants_property_id_fkey,
DROP CONSTRAINT IF EXISTS tenants_payment_scheme_check,
DROP CONSTRAINT IF EXISTS tenants_last_payment_date_check;

-- Recreate tenants table with proper structure
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  property_id uuid NOT NULL,
  payment_scheme text NOT NULL CHECK (payment_scheme IN ('subscription', 'flex')),
  last_payment_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT tenants_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT tenants_property_id_fkey FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT tenants_last_payment_date_check CHECK (last_payment_date IS NULL OR last_payment_date <= CURRENT_TIMESTAMP),
  UNIQUE(property_id, profile_id)
);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Tenants can view their own records" ON tenants;
CREATE POLICY "Tenants can view their own records"
ON tenants
FOR SELECT
TO authenticated
USING (profile_id = auth.uid());

DROP POLICY IF EXISTS "Owners can manage tenants of their properties" ON tenants;
CREATE POLICY "Owners can manage tenants of their properties"
ON tenants
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = tenants.property_id
    AND properties.owner_id = auth.uid()
  )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tenants_profile_id ON tenants(profile_id);
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_payment_scheme ON tenants(payment_scheme);
CREATE INDEX IF NOT EXISTS idx_tenants_last_payment_date ON tenants(last_payment_date DESC);

-- Create or replace the trigger function for updating last_payment_date
CREATE OR REPLACE FUNCTION update_tenant_last_payment_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' THEN
    UPDATE tenants
    SET last_payment_date = NEW.date,
        updated_at = now()
    WHERE id = NEW.tenant_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS update_tenant_payment_date ON payments;
CREATE TRIGGER update_tenant_payment_date
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_tenant_last_payment_date();