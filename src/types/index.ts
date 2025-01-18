export type PaymentScheme = 'subscription' | 'flex';

export interface Property {
  id: string;
  name: string;
  address: string;
  monthlyRent: number;
  paymentScheme: PaymentScheme;
  active: boolean;
  tenantId?: string;
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