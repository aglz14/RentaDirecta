/*
  # Update profile creation trigger to match signup form

  1. Updates
    - Add metadata handling from raw_user_meta_data
    - Initialize profile with signup form data
    - Maintain all existing validations
    
  2. Security
    - Maintains existing security settings
    - Adds validation for new fields
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
  profile_exists boolean;
  first_name_val text;
  last_name_val text;
  whatsapp_val text;
BEGIN
  -- Input validation with detailed error messages
  IF NEW.id IS NULL THEN
    RAISE EXCEPTION 'Registration failed: User ID cannot be null';
  END IF;

  IF NEW.email IS NULL OR NEW.email = '' THEN
    RAISE EXCEPTION 'Registration failed: Email address is required';
  END IF;

  -- Comprehensive email format validation
  IF NEW.email !~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Registration failed: Invalid email format. Please provide a valid email address';
  END IF;

  -- Extract metadata from raw_user_meta_data
  first_name_val := COALESCE((NEW.raw_user_meta_data->>'first_name')::text, '');
  last_name_val := COALESCE((NEW.raw_user_meta_data->>'last_name')::text, '');
  whatsapp_val := COALESCE((NEW.raw_user_meta_data->>'whatsapp')::text, '');

  -- Validate WhatsApp format if provided
  IF whatsapp_val != '' AND whatsapp_val !~ '^[0-9]{10,}$' THEN
    RAISE EXCEPTION 'Registration failed: WhatsApp number must contain at least 10 digits';
  END IF;

  -- Check if profile already exists to prevent duplicate entries
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = NEW.id OR email = NEW.email
  ) INTO profile_exists;

  IF profile_exists THEN
    -- Profile exists, return without error to allow login
    RETURN NEW;
  END IF;

  -- Create new profile with proper error handling
  BEGIN
    INSERT INTO public.profiles (
      id,
      email,
      first_name,
      last_name,
      whatsapp,
      created_at,
      updated_at
    )
    VALUES (
      NEW.id,
      NEW.email,
      first_name_val,
      last_name_val,
      whatsapp_val,
      NOW(),
      NOW()
    );
  EXCEPTION
    WHEN unique_violation THEN
      -- Handle race condition where profile might have been created between our check and insert
      RETURN NEW;
    WHEN check_violation THEN
      RAISE EXCEPTION 'Registration failed: Invalid data format. Please check your input';
    WHEN OTHERS THEN
      -- Log error details and provide user-friendly message
      RAISE EXCEPTION 'Registration failed: Internal error (%). Please try again', SQLERRM;
  END;

  RETURN NEW;
END;
$$;