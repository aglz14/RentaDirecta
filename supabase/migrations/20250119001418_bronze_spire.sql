/*
  # Add WhatsApp field to profiles table

  1. Changes
    - Add `whatsapp` column to `profiles` table
    - Make it required (NOT NULL)
    - Add check constraint to ensure valid format
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'whatsapp'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN whatsapp text NOT NULL DEFAULT '';

    -- Add check constraint for WhatsApp format (at least 10 digits)
    ALTER TABLE profiles 
    ADD CONSTRAINT whatsapp_format CHECK (whatsapp ~ '^[0-9]{10,}$');

    -- Remove the default after adding the column
    ALTER TABLE profiles 
    ALTER COLUMN whatsapp DROP DEFAULT;
  END IF;
END $$;