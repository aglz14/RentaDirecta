
CREATE TABLE IF NOT EXISTS public.building (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  exterior_number TEXT NOT NULL,
  interior_number TEXT,
  neighborhood TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.building ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own buildings"
  ON public.building
  FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own buildings"
  ON public.building
  FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own buildings"
  ON public.building
  FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own buildings"
  ON public.building
  FOR DELETE
  USING (auth.uid() = owner_id);
