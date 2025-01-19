import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key);
};

// Get Supabase configuration with error handling
const getSupabaseConfig = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Missing Supabase environment variables. Please connect your project to Supabase.');
    return null;
  }

  return { url, key };
};

// Create the Supabase client with type safety
const config = getSupabaseConfig();

export const supabase = config
  ? createClient<Database>(config.url, config.key, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        storage: window.localStorage, // Explicitly set storage to localStorage
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    })
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Helper function to validate WhatsApp number
export const validateWhatsApp = (number: string) => {
  return /^[0-9]{10,}$/.test(number);
};

// Helper function to validate email
export const validateEmail = (email: string) => {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
};