export interface Building {
  id: string;
  name: string;
  street: string;
  exterior_number: string;
  interior_number: string | null;
  neighborhood: string;
  zip_code: string;
  city: string;
  state: string;
  country: string;
  predial?: string | null;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  expirationDate: string | null;
  size: string;
}