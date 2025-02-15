
BEGIN;

CREATE TABLE IF NOT EXISTS public.building_types (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default building types
INSERT INTO public.building_types (name, value) VALUES
  ('Edificio de Apartamentos', 'apartment'),
  ('Edificio de Oficinas', 'office'),
  ('Edificio Comercial', 'commercial'),
  ('Uso Mixto', 'mixed'),
  ('Otro', 'other')
ON CONFLICT (value) DO NOTHING;

COMMIT;
