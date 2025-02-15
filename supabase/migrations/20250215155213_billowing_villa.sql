/*
  # Add Predial Column to Buildings Table

  1. Changes
    - Adds predial column to buildings table
    - Adds validation for predial format

  2. Security
    - Maintains existing RLS policies
*/

-- Add predial column to buildings table
ALTER TABLE buildings
ADD COLUMN IF NOT EXISTS predial text;

-- Add check constraint for predial format
ALTER TABLE buildings
ADD CONSTRAINT buildings_predial_format
CHECK (predial IS NULL OR length(trim(predial)) >= 5);

-- Create index for predial searches
CREATE INDEX IF NOT EXISTS idx_buildings_predial
ON buildings(predial);