/*
  # Fix Property Types Relationship

  1. Changes
    - Updates the query structure for property_types relationship
    - Adds proper join conditions
    - Ensures correct column references

  2. Security
    - Maintains existing RLS policies
*/

-- Update properties table to ensure correct relationship
ALTER TABLE properties
  DROP CONSTRAINT IF EXISTS properties_property_type_id_fkey;

ALTER TABLE properties
  ADD CONSTRAINT properties_property_type_id_fkey 
  FOREIGN KEY (property_type_id) 
  REFERENCES property_types(id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_properties_property_type_id 
ON properties(property_type_id);

-- Ensure property_types has proper RLS
ALTER TABLE property_types ENABLE ROW LEVEL SECURITY;

-- Recreate the policy to ensure it exists
DROP POLICY IF EXISTS "Anyone can read property types" ON property_types;
CREATE POLICY "Anyone can read property types"
  ON property_types
  FOR SELECT
  TO authenticated
  USING (true);