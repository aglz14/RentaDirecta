/*
  # Initial Schema Setup

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `properties`
      - `id` (uuid, primary key)
      - `owner_id` (uuid, references profiles)
      - `name` (text)
      - `address` (text)
      - `monthly_rent` (numeric)
      - `payment_scheme` (text)
      - `active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tenants`
      - `id` (uuid, primary key)
      - `property_id` (uuid, references properties)
      - `profile_id` (uuid, references profiles)
      - `payment_scheme` (text)
      - `last_payment_date` (timestamp)
      - `next_payment_date` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `payments`
      - `id` (uuid, primary key)
      - `tenant_id` (uuid, references tenants)
      - `property_id` (uuid, references properties)
      - `amount` (numeric)
      - `date` (timestamp)
      - `method` (text)
      - `status` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  monthly_rent numeric NOT NULL CHECK (monthly_rent > 0),
  payment_scheme text NOT NULL CHECK (payment_scheme IN ('subscription', 'flex')),
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can CRUD their properties"
  ON properties
  FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

-- Create tenants table
CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties ON DELETE CASCADE NOT NULL,
  profile_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  payment_scheme text NOT NULL CHECK (payment_scheme IN ('subscription', 'flex')),
  last_payment_date timestamptz,
  next_payment_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(property_id, profile_id)
);

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage tenants of their properties"
  ON tenants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = tenants.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view their own records"
  ON tenants
  FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants ON DELETE CASCADE NOT NULL,
  property_id uuid REFERENCES properties ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL CHECK (amount > 0),
  date timestamptz DEFAULT now(),
  method text NOT NULL CHECK (method IN ('transfer', 'debit', 'credit', 'convenience', 'subscription')),
  status text NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view payments for their properties"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM properties
      WHERE properties.id = payments.property_id
      AND properties.owner_id = auth.uid()
    )
  );

CREATE POLICY "Tenants can view their own payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tenants
      WHERE tenants.id = payments.tenant_id
      AND tenants.profile_id = auth.uid()
    )
  );

-- Create functions and triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON tenants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();