export type PaymentScheme = 'subscription' | 'flex';

export interface Property {
  id: string;
  name: string;
  address: string;
  monthly_rent: number;
  active: boolean;
  property_type?: {
    name: string;
  };
  property_type_id: string;
  building_id?: string;
}

export interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  paymentScheme: PaymentScheme;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
}

export interface Payment {
  id: string;
  tenantId: string;
  propertyId: string;
  amount: number;
  date: Date;
  method: 'transfer' | 'debit' | 'credit' | 'convenience' | 'subscription';
  status: 'pending' | 'completed' | 'failed';
}