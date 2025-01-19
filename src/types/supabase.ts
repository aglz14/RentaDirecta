export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          full_name: string | null
          whatsapp: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          whatsapp: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          whatsapp?: string
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          name: string
          address: string
          monthly_rent: number
          payment_scheme: 'subscription' | 'flex'
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          address: string
          monthly_rent: number
          payment_scheme: 'subscription' | 'flex'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          address?: string
          monthly_rent?: number
          payment_scheme?: 'subscription' | 'flex'
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      tenants: {
        Row: {
          id: string
          property_id: string
          profile_id: string
          payment_scheme: 'subscription' | 'flex'
          last_payment_date: string | null
          next_payment_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          property_id: string
          profile_id: string
          payment_scheme: 'subscription' | 'flex'
          last_payment_date?: string | null
          next_payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          property_id?: string
          profile_id?: string
          payment_scheme?: 'subscription' | 'flex'
          last_payment_date?: string | null
          next_payment_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          tenant_id: string
          property_id: string
          amount: number
          date: string
          method: 'transfer' | 'debit' | 'credit' | 'convenience' | 'subscription'
          status: 'pending' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          property_id: string
          amount: number
          date?: string
          method: 'transfer' | 'debit' | 'credit' | 'convenience' | 'subscription'
          status: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          property_id?: string
          amount?: number
          date?: string
          method?: 'transfer' | 'debit' | 'credit' | 'convenience' | 'subscription'
          status?: 'pending' | 'completed' | 'failed'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}