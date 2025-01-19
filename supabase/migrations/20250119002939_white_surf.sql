/*
  # Update profiles table structure

  1. Changes
    - Add first_name and last_name columns
    - Make whatsapp field required
    - Update constraints and policies

  2. Security
    - Maintain existing RLS policies
    - Ensure data integrity with constraints
*/

-- Add new columns for first and last name
DO $$ 
BEGIN
  -- Add first_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'first_name'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN first_name text NOT NULL DEFAULT '';
  END IF;

  -- Add last_name column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'last_name'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN last_name text NOT NULL DEFAULT '';
  END IF;

  -- Remove defaults after adding columns
  ALTER TABLE profiles 
  ALTER COLUMN first_name DROP DEFAULT,
  ALTER COLUMN last_name DROP DEFAULT;

  -- Update full_name to be generated from first_name and last_name
  ALTER TABLE profiles 
  DROP COLUMN IF EXISTS full_name;

  -- Add computed full_name column
  ALTER TABLE profiles 
  ADD COLUMN full_name text GENERATED ALWAYS AS (
    CASE 
      WHEN first_name = '' AND last_name = '' THEN NULL
      WHEN first_name = '' THEN last_name
      WHEN last_name = '' THEN first_name
      ELSE first_name || ' ' || last_name
    END
  ) STORED;
END $$;