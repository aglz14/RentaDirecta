-- First, ensure we have the correct profiles table structure
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  whatsapp text NOT NULL,
  user_type text NOT NULL CHECK (user_type IN ('propietario', 'inquilino')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Drop and recreate the tenants table to ensure clean relationships
DROP TABLE IF EXISTS tenants CASCADE;

CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL,
  property_id uuid NOT NULL,
  payment_scheme text NOT NULL CHECK (payment_scheme IN ('subscription', 'flex')),
  last_payment_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT tenants_profile_id_fkey FOREIGN KEY (profile_id) 
    REFERENCES profiles(id) ON DELETE CASCADE,
  CONSTRAINT tenants_property_id_fkey FOREIGN KEY (property_id) 
    REFERENCES properties(id) ON DELETE CASCADE,
  CONSTRAINT tenants_unique_profile_property UNIQUE(profile_id, property_id)
);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Tenants can view their own records"
ON tenants FOR SELECT
TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "Owners can manage tenants of their properties"
ON tenants FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = tenants.property_id
    AND properties.owner_id = auth.uid()
  )
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tenants_profile_id ON tenants(profile_id);
CREATE INDEX IF NOT EXISTS idx_tenants_property_id ON tenants(property_id);
CREATE INDEX IF NOT EXISTS idx_tenants_payment_scheme ON tenants(payment_scheme);
CREATE INDEX IF NOT EXISTS idx_tenants_last_payment_date ON tenants(last_payment_date DESC);

-- Recreate the trigger function
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

-- Recreate the trigger
DROP TRIGGER IF EXISTS update_tenant_payment_date ON payments;
CREATE TRIGGER update_tenant_payment_date
  AFTER INSERT OR UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_tenant_last_payment_date();