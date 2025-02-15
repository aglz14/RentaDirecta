-- Drop and recreate the tenants table with proper structure
DROP TABLE IF EXISTS tenants CASCADE;

CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  property_id uuid NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  payment_scheme text NOT NULL CHECK (payment_scheme IN ('subscription', 'flex')),
  last_payment_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT tenants_unique_profile_property UNIQUE(profile_id, property_id)
);

-- Enable RLS
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- Create policies
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
CREATE INDEX idx_tenants_profile_id ON tenants(profile_id);
CREATE INDEX idx_tenants_property_id ON tenants(property_id);
CREATE INDEX idx_tenants_payment_scheme ON tenants(payment_scheme);
CREATE INDEX idx_tenants_last_payment_date ON tenants(last_payment_date DESC);

-- Insert some sample data
INSERT INTO tenants (profile_id, property_id, payment_scheme)
SELECT 
  p.id as profile_id,
  pr.id as property_id,
  'subscription' as payment_scheme
FROM profiles p
CROSS JOIN properties pr
WHERE p.user_type = 'inquilino'
AND NOT EXISTS (
  SELECT 1 FROM tenants t 
  WHERE t.profile_id = p.id 
  AND t.property_id = pr.id
)
LIMIT 3;