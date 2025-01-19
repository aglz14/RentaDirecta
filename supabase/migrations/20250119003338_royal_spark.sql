/*
  # Update profiles table structure

  1. Changes
    - Ensure all required fields exist with proper constraints
    - Add validation for WhatsApp format
    - Set up computed full_name column
    - Add appropriate indexes for performance

  2. Security
    - Maintain RLS policies
    - Add data validation constraints
*/

-- Ensure all required columns exist with proper constraints
DO $$ 
BEGIN
  -- First ensure the table exists
  CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Add email column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN email text NOT NULL UNIQUE;
  END IF;

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

  -- Add whatsapp column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN whatsapp text NOT NULL DEFAULT '';
  END IF;

  -- Remove default values after adding columns
  ALTER TABLE profiles 
  ALTER COLUMN first_name DROP DEFAULT,
  ALTER COLUMN last_name DROP DEFAULT,
  ALTER COLUMN whatsapp DROP DEFAULT;

  -- Add or update the computed full_name column
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'full_name'
  ) THEN
    ALTER TABLE profiles DROP COLUMN full_name;
  END IF;

  ALTER TABLE profiles 
  ADD COLUMN full_name text GENERATED ALWAYS AS (
    CASE 
      WHEN first_name = '' AND last_name = '' THEN NULL
      WHEN first_name = '' THEN last_name
      WHEN last_name = '' THEN first_name
      ELSE first_name || ' ' || last_name
    END
  ) STORED;

  -- Add or update constraints
  ALTER TABLE profiles 
  DROP CONSTRAINT IF EXISTS whatsapp_format;

  ALTER TABLE profiles 
  ADD CONSTRAINT whatsapp_format 
  CHECK (whatsapp ~ '^[0-9]{10,}$');

  -- Create indexes for better performance
  CREATE INDEX IF NOT EXISTS idx_profiles_email 
  ON profiles(email);

  CREATE INDEX IF NOT EXISTS idx_profiles_full_name 
  ON profiles(full_name);
END $$;

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create or update policies
CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Create or replace the updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();