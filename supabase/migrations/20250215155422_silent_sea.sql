/*
  # Add Predial Column to Properties Table

  1. Changes
    - Adds predial column to properties table
    - Adds validation for predial format

  2. Security
    - Maintains existing RLS policies
*/

-- Add predial column to properties table
ALTER TABLE properties
ADD COLUMN IF NOT EXISTS predial text;

-- Add check constraint for predial format
ALTER TABLE properties
ADD CONSTRAINT properties_predial_format
CHECK (predial IS NULL OR length(trim(predial)) >= 5);

-- Create index for predial searches
CREATE INDEX IF NOT EXISTS idx_properties_predial
ON properties(predial);