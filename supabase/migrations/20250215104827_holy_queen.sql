-- Ensure we have a consistent property_types table
CREATE TABLE IF NOT EXISTS property_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;

-- Create policy for property_types
CREATE POLICY "Anyone can read property types"
  ON property_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default property types
INSERT INTO property_types (name) VALUES
  ('Casa'),
  ('Departamento'),
  ('Local'),
  ('Oficina'),
  ('Bodega'),
  ('Terreno')
ON CONFLICT (name) DO NOTHING;

-- Update properties table to reference property_types
ALTER TABLE properties 
  DROP CONSTRAINT IF EXISTS properties_property_type_id_fkey,
  ADD CONSTRAINT properties_property_type_id_fkey 
    FOREIGN KEY (property_type_id) 
    REFERENCES property_types(id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_property_types_name 
ON property_types(name);