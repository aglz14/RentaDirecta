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
  global: {
    headers: {
      'X-Client-Info': 'rentadirecta-web',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  // Add retry configuration
  fetch: (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Cache-Control': 'no-cache',
      },
    }).then(async (response) => {
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Network response was not ok');
      }
      return response;
    });
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

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  console.error('Supabase error:', error);
  
  if (error?.message?.includes('Failed to fetch')) {
    return 'Error de conexión. Por favor, verifica tu conexión a internet e intenta de nuevo.';
  }
  
  if (error?.code === 'PGRST301') {
    return 'La sesión ha expirado. Por favor, inicia sesión nuevamente.';
  }
  
  return error?.message || 'Ha ocurrido un error. Por favor, intenta de nuevo.';
};