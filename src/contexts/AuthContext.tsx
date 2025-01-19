import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase, clearAuthData } from '@/lib/supabase';

interface Profile {
  full_name: string | null;
  email: string;
  first_name: string;
  last_name: string;
  whatsapp: string;
  user_type: 'propietario' | 'inquilino';
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const storedSession = localStorage.getItem('sb-kgepsmcikgxoqjzhjxwq-auth-token');
    if (storedSession) {
      try {
        const { user } = JSON.parse(storedSession);
        return user;
      } catch (e) {
        console.error('Error parsing stored session:', e);
        return null;
      }
    }
    return null;
  });
  const [profile, setProfile] = useState<Profile | null>(() => {
    const storedProfile = localStorage.getItem('user_profile');
    if (storedProfile) {
      try {
        return JSON.parse(storedProfile);
      } catch (e) {
        console.error('Error parsing stored profile:', e);
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      console.log('Profile data:', data);
      if (data) {
        localStorage.setItem('user_profile', JSON.stringify(data));
        setProfile(data as Profile);
        return data as Profile;
      }
      return null;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const refreshProfile = async (userId: string) => {
    const updatedProfile = await fetchProfile(userId);
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && mounted) {
          console.log('Session found:', session.user.id);
          setUser(session.user);
          
          if (!profile) {
            await fetchProfile(session.user.id);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.id);
      
      if (!mounted) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('user_profile');
        navigate('/', { replace: true });
      } else if (session?.user) {
        setUser(session.user);
        if (!profile || profile.id !== session.user.id) {
          await fetchProfile(session.user.id);
        }
      }
      
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, profile]);

  const signOut = async () => {
    try {
      clearAuthData();
      localStorage.removeItem('user_profile');
      setUser(null);
      setProfile(null);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};