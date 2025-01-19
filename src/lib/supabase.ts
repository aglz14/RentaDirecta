import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: window.localStorage,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});

// Helper function to validate WhatsApp number
export const validateWhatsApp = (number: string) => {
  return /^[0-9]{10,}$/.test(number);
};

// Helper function to validate email
export const validateEmail = (email: string) => {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
};

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Helper function to clear auth data on explicit logout
export const clearAuthData = () => {
  window.localStorage.removeItem('supabase.auth.token');
  window.localStorage.removeItem('sb-kgepsmcikgxoqjzhjxwq-auth-token');
  supabase.auth.signOut();
};