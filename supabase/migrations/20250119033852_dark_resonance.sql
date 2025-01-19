/*
  # Add profile creation trigger

  1. New Function
    - `handle_new_user`: Creates a profile entry when a new user signs up
  
  2. New Trigger
    - Automatically creates profile entry after user insertion
    
  3. Security
    - Function is set to be executed with security definer rights
    - Only the auth schema can execute the trigger
*/

-- Create the function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
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
  RETURN NEW;
END;
$$;

-- Create the trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();