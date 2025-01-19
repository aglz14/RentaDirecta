/*
  # Improve profile creation trigger

  1. Updates
    - Add input validation
    - Add error handling
    - Add email validation
    
  2. Security
    - Maintains existing security settings
    - Adds additional validation
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  -- Input validation
  IF NEW.id IS NULL THEN
    RAISE EXCEPTION 'User ID cannot be null';
  END IF;

  IF NEW.email IS NULL THEN
    RAISE EXCEPTION 'User email cannot be null';
  END IF;

  -- Email format validation
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;

  -- Insert with error handling
  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      first_name,
      last_name,
      whatsapp
    )
    VALUES (
      NEW.id,
      NEW.email,
      '', -- Will be updated by the signup form
      '', -- Will be updated by the signup form
      '' -- Will be updated by the signup form
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- Profile already exists, ignore
      RETURN NEW;
    WHEN OTHERS THEN
      -- Log other errors and re-raise
      RAISE EXCEPTION 'Failed to create profile: %', SQLERRM;
  END;

  RETURN NEW;
END;
$$;