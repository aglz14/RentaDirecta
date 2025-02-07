-- Create property_type table
CREATE TABLE IF NOT EXISTS property_type (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create building table
CREATE TABLE IF NOT EXISTS building (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  address text NOT NULL,
  owner_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE property_type ENABLE ROW LEVEL SECURITY;
ALTER TABLE building ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can read property types"
  ON property_type
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Owners can manage their buildings"
  ON building
  FOR ALL
  TO authenticated
  USING (owner_id = auth.uid());

-- Add default property types
INSERT INTO property_type (name) VALUES
  ('Casa'),
  ('Departamento'),
  ('Local'),
  ('Oficina'),
  ('Bodega'),
  ('Terreno')
ON CONFLICT (name) DO NOTHING;

-- Add columns to properties table if they don't exist
DO $$ 
BEGIN
  -- Add property_type_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'property_type_id'
  ) THEN
    ALTER TABLE properties
    ADD COLUMN property_type_id uuid REFERENCES property_type(id);
  END IF;

  -- Add building_id column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'properties' AND column_name = 'building_id'
  ) THEN
    ALTER TABLE properties
    ADD COLUMN building_id uuid REFERENCES building(id);
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_property_type_id ON properties(property_type_id);
CREATE INDEX IF NOT EXISTS idx_properties_building_id ON properties(building_id);
CREATE INDEX IF NOT EXISTS idx_building_owner ON building(owner_id);