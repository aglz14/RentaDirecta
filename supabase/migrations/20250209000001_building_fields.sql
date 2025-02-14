
ALTER TABLE building 
ADD COLUMN IF NOT EXISTS street TEXT,
ADD COLUMN IF NOT EXISTS exterior_number TEXT,
ADD COLUMN IF NOT EXISTS interior_number TEXT,
ADD COLUMN IF NOT EXISTS zip_code TEXT,
ADD COLUMN IF NOT EXISTS neighborhood TEXT;

COMMENT ON COLUMN building.street IS 'Street name of the building';
COMMENT ON COLUMN building.exterior_number IS 'Exterior number of the building';
COMMENT ON COLUMN building.interior_number IS 'Interior number of the building (optional)';
COMMENT ON COLUMN building.zip_code IS 'ZIP code of the building location';
COMMENT ON COLUMN building.neighborhood IS 'Neighborhood/Colonia of the building';
