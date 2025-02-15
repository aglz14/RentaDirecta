/*
  # Fix Properties Schema

  1. Changes
    - Add missing columns to properties table
    - Add constraints and defaults
    - Create indexes for better performance

  2. New Columns
    - street (text, required)
    - unit_number (text, required)
    - neighborhood (text, required)
    - zip_code (text, required)
    - city (text, required)
    - state (text, required)
    - country (text, required)
    - currency (text, default 'MXN')
    - owner_name (text)
    - owner_email (text)

  3. Constraints
    - Added NOT NULL constraints for required fields
    - Added check constraint for currency
    - Added length constraints for text fields
*/

-- Add missing columns and constraints to properties table
DO $$ 
BEGIN
  -- Add columns if they don't exist
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

  -- Add NOT NULL constraints
  ALTER TABLE properties
    ALTER COLUMN street SET NOT NULL,
    ALTER COLUMN unit_number SET NOT NULL,
    ALTER COLUMN neighborhood SET NOT NULL,
    ALTER COLUMN zip_code SET NOT NULL,
    ALTER COLUMN city SET NOT NULL,
    ALTER COLUMN state SET NOT NULL,
    ALTER COLUMN country SET NOT NULL;

  -- Add check constraints
  ALTER TABLE properties
    ADD CONSTRAINT properties_currency_check 
    CHECK (currency IN ('MXN', 'USD')),
    ADD CONSTRAINT properties_street_length 
    CHECK (length(trim(street)) >= 5),
    ADD CONSTRAINT properties_unit_number_length 
    CHECK (length(trim(unit_number)) >= 1),
    ADD CONSTRAINT properties_neighborhood_length 
    CHECK (length(trim(neighborhood)) >= 3),
    ADD CONSTRAINT properties_zip_code_length 
    CHECK (length(trim(zip_code)) >= 5),
    ADD CONSTRAINT properties_city_length 
    CHECK (length(trim(city)) >= 2),
    ADD CONSTRAINT properties_state_length 
    CHECK (length(trim(state)) >= 2),
    ADD CONSTRAINT properties_country_length 
    CHECK (length(trim(country)) >= 2);

  -- Add email format check
  ALTER TABLE properties
    ADD CONSTRAINT properties_owner_email_format 
    CHECK (owner_email IS NULL OR owner_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_properties_street_city 
ON properties(street, city);

CREATE INDEX IF NOT EXISTS idx_properties_unit_number 
ON properties(unit_number);

CREATE INDEX IF NOT EXISTS idx_properties_neighborhood 
ON properties(neighborhood);

CREATE INDEX IF NOT EXISTS idx_properties_zip_code 
ON properties(zip_code);

-- Create partial index for active properties
CREATE INDEX IF NOT EXISTS idx_properties_active 
ON properties(created_at DESC) 
WHERE active = true;

-- Update RLS policies
DROP POLICY IF EXISTS "Users can manage their own properties" ON properties;
CREATE POLICY "Users can manage their own properties"
ON properties
FOR ALL
TO authenticated
USING (owner_id = auth.uid());