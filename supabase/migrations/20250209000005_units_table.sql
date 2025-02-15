
-- Ensure property types table exists and has the correct name
ALTER TABLE IF EXISTS property_type RENAME TO property_types;

-- Ensure properties table has all required fields
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  monthly_rent numeric NOT NULL CHECK (monthly_rent > 0),
  payment_scheme text NOT NULL CHECK (payment_scheme IN ('subscription', 'flex')),
  active boolean DEFAULT true,
  property_type_id uuid REFERENCES property_types(id),
  building_id uuid REFERENCES buildings(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users
CREATE POLICY "Users can manage their own properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_owner ON properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_building ON properties(building_id);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(property_type_id);
