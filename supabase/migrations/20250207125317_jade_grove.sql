-- Create property_types table
CREATE TABLE IF NOT EXISTS property_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create buildings table
CREATE TABLE IF NOT EXISTS buildings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read property types"
  ON property_types
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can manage their buildings"
  ON buildings
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Add default property types
INSERT INTO property_types (name) VALUES
  ('Casa'),
  ('Departamento'),
  ('Local'),
  ('Oficina'),
  ('Bodega'),
  ('Terreno')
ON CONFLICT (name) DO NOTHING;

-- Add column to properties table if it doesn't exist
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS property_type_id uuid REFERENCES property_types(id),
ADD COLUMN IF NOT EXISTS building_id uuid REFERENCES buildings(id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_property_type_id ON properties(property_type_id);
CREATE INDEX IF NOT EXISTS idx_properties_building_id ON properties(building_id);
CREATE INDEX IF NOT EXISTS idx_buildings_owner ON buildings(owner_id);