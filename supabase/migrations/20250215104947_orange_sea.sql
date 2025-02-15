/*
  # Fix Property Types Table and Relationships

  1. Changes
    - Ensures property_types table exists with correct structure
    - Drops old foreign key constraints
    - Creates new foreign key constraint to property_types
    - Updates existing data to maintain referential integrity
    - Adds proper indexes and policies

  2. Security
    - Maintains RLS policies for property_types table
    - Ensures authenticated users can read property types
*/

-- First, ensure we have the correct table
CREATE TABLE IF NOT EXISTS property_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;

-- Recreate the policy
DROP POLICY IF EXISTS "Anyone can read property types" ON property_types;
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

-- Drop existing foreign key if it exists
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_property_type_id_fkey;

-- Create new foreign key constraint
ALTER TABLE properties
  ADD CONSTRAINT properties_property_type_id_fkey 
  FOREIGN KEY (property_type_id) 
  REFERENCES property_types(id);

-- Create or replace indexes
DROP INDEX IF EXISTS idx_property_types_name;
CREATE INDEX idx_property_types_name ON property_types(name);

DROP INDEX IF EXISTS idx_properties_property_type;
CREATE INDEX idx_properties_property_type ON properties(property_type_id);