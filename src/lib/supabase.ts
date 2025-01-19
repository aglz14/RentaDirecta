import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return Boolean(url && key);
};

// Create the Supabase client with type safety
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://localhost';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: import.meta.env.DEV, // Enable debug logs in development
    onAuthStateChange: (event, session) => {
      if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        // Clear any cached data when user signs out
        localStorage.removeItem('supabase.auth.token');
        
        // Optionally reload the page to ensure a clean state
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      }
    },
  },
  global: {
    headers: {
      'X-Client-Info': 'rentadirecta-web',
    },
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

// Helper function to check if there's an active session
export const hasValidSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return !!session;
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};

// Helper function to handle auth errors
export const handleAuthError = (error: any) => {
  if (error?.message?.includes('refresh_token_not_found')) {
    return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
  }
  return error?.message || 'Ha ocurrido un error de autenticación.';
};