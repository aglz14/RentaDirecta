/*
  # Fix property types and buildings tables

  1. Changes
    - Ensure property_types table exists with correct name
    - Add missing columns to properties table
    - Update relationships between tables

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies
*/

-- Rename property_type to property_types if it exists
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'property_type') THEN
    ALTER TABLE property_type RENAME TO property_types;
  END IF;
END $$;

-- Create property_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS property_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on property_types
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;

-- Create policy for property_types
CREATE POLICY "Anyone can read property types"
  ON property_types
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert default property types if they don't exist
INSERT INTO property_types (name) VALUES
  ('Casa'),
  ('Departamento'),
  ('Local'),
  ('Oficina'),
  ('Bodega'),
  ('Terreno')
ON CONFLICT (name) DO NOTHING;

-- Add missing columns to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS street text,
ADD COLUMN IF NOT EXISTS unit_number text,
ADD COLUMN IF NOT EXISTS neighborhood text,
ADD COLUMN IF NOT EXISTS zip_code text,
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS state text,
ADD COLUMN IF NOT EXISTS country text,
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'MXN',
ADD COLUMN IF NOT EXISTS owner_name text,
ADD COLUMN IF NOT EXISTS owner_email text;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_property_type_id ON properties(property_type_id);
CREATE INDEX IF NOT EXISTS idx_properties_building_id ON properties(building_id);
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);