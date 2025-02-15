-- Drop existing foreign key if it exists
ALTER TABLE tenants
DROP CONSTRAINT IF EXISTS tenants_profile_id_fkey;

-- Add proper foreign key constraint
ALTER TABLE tenants
ADD CONSTRAINT tenants_profile_id_fkey
FOREIGN KEY (profile_id)
REFERENCES profiles(id)
ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_tenants_profile_id
ON tenants(profile_id);

-- Update RLS policies
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