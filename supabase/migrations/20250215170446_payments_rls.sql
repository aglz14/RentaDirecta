
-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create policy for payments view
CREATE POLICY "Users can view payments" ON payments
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND (
        -- Property owner can see all payments for their properties
        EXISTS (
          SELECT 1 FROM properties 
          WHERE properties.id = payments.property_id
          AND properties.owner_id = profiles.id
        )
        OR 
        -- Tenant can see their own payments
        EXISTS (
          SELECT 1 FROM tenants
          WHERE tenants.id = payments.tenant_id
          AND tenants.profile_id = profiles.id
        )
      )
    )
  );

-- Create policy for payments insert
CREATE POLICY "Users can insert payments" ON payments
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.user_id = auth.uid()
      AND (
        -- Property owner can add payments
        EXISTS (
          SELECT 1 FROM properties 
          WHERE properties.id = payments.property_id
          AND properties.owner_id = profiles.id
        )
        OR 
        -- Tenant can add their own payments
        EXISTS (
          SELECT 1 FROM tenants
          WHERE tenants.id = payments.tenant_id
          AND tenants.profile_id = profiles.id
        )
      )
    )
  );
