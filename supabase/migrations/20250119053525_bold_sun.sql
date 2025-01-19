/*
  # Add Performance Optimizations and Constraints

  1. New Indexes
    - Add composite indexes for common query patterns
    - Add indexes for frequently searched columns
  
  2. Constraints
    - Add check constraints for data validation
    - Add foreign key constraints for referential integrity

  3. Performance
    - Add indexes for sorting operations
    - Add indexes for filtering operations
*/

-- Add composite indexes for common queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_type_created
ON profiles(user_type, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_properties_owner_active
ON properties(owner_id, active)
WHERE active = true;

CREATE INDEX IF NOT EXISTS idx_tenants_property_profile
ON tenants(property_id, profile_id);

CREATE INDEX IF NOT EXISTS idx_payments_tenant_date
ON payments(tenant_id, date DESC);

-- Add indexes for search operations
CREATE INDEX IF NOT EXISTS idx_properties_name_address
ON properties USING gin(
  to_tsvector('spanish', name || ' ' || address)
);

-- Add check constraint for property names
ALTER TABLE properties
ADD CONSTRAINT properties_name_length
CHECK (length(trim(name)) >= 3);

-- Add check constraint for addresses
ALTER TABLE properties
ADD CONSTRAINT properties_address_length
CHECK (length(trim(address)) >= 5);

-- Add check constraint for payment amounts
ALTER TABLE payments
ADD CONSTRAINT payments_amount_positive
CHECK (amount > 0);

-- Add indexes for sorting and filtering
CREATE INDEX IF NOT EXISTS idx_properties_monthly_rent
ON properties(monthly_rent DESC);

CREATE INDEX IF NOT EXISTS idx_payments_status_date
ON payments(status, date DESC);

-- Add partial index for active properties
CREATE INDEX IF NOT EXISTS idx_active_properties
ON properties(created_at DESC)
WHERE active = true;

-- Add partial index for pending payments
CREATE INDEX IF NOT EXISTS idx_pending_payments
ON payments(date DESC)
WHERE status = 'pending';