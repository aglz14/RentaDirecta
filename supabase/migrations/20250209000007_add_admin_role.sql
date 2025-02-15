
-- Add is_admin column to auth.users if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'auth' 
                  AND table_name = 'users' 
                  AND column_name = 'is_admin') THEN
        ALTER TABLE auth.users ADD COLUMN is_admin BOOLEAN DEFAULT false;
    END IF;
END $$;

-- Create a function to check if a user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update the RLS policies to use the new function
DROP POLICY IF EXISTS "Only admin users can insert building types" ON public.building_types;
CREATE POLICY "Only admin users can insert building types" ON public.building_types
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Only admin users can update building types" ON public.building_types;
CREATE POLICY "Only admin users can update building types" ON public.building_types
  FOR UPDATE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "Only admin users can delete building types" ON public.building_types;
CREATE POLICY "Only admin users can delete building types" ON public.building_types
  FOR DELETE TO authenticated
  USING (public.is_admin());
