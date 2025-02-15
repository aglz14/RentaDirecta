
-- Rename tables to ensure consistency
ALTER TABLE IF EXISTS building RENAME TO buildings;
ALTER TABLE IF EXISTS property RENAME TO properties;

-- Recreate properties table if it doesn't exist
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  property_type_id uuid REFERENCES property_type(id),
  building_id uuid REFERENCES buildings(id),
  monthly_rent numeric NOT NULL CHECK (monthly_rent > 0),
  payment_scheme text NOT NULL CHECK (payment_scheme IN ('subscription', 'flex')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy for owners
CREATE POLICY "Owners can manage their properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_building ON properties(building_id);
