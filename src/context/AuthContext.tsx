
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthUser } from '@/lib/authTypes';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/types/profile';

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDevMode?: boolean;
  error?: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: "mentor" | "client", company?: string, phone?: string, position?: string, bio?: string) => Promise<AuthUser | null>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadSession = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error("Erro ao buscar perfil:", error);
          setIsAuthenticated(false);
          setUser(null);
        } else {
          setIsAuthenticated(true);
          // Type casting the profile to ensure TypeScript recognizes all properties
          const typedProfile = profile as Profile;
          
          setUser({
            id: typedProfile.id,
            email: typedProfile.email || null,
            name: typedProfile.name || '',
            role: typedProfile.role as "mentor" | "client",
            company: typedProfile.company,
            phone: typedProfile.phone,
            position: typedProfile.position,
            bio: typedProfile.bio,
            avatar_url: typedProfile.avatar_url || null,
            createdAt: typedProfile.created_at,
            mentor_id: typedProfile.mentor_id,
            cnpj: typedProfile.cnpj || null,
            industry: typedProfile.industry || null,
            address: typedProfile.address || null,
            city: typedProfile.city || null,
            state: typedProfile.state || null,
            zipCode: typedProfile.zipCode || null,
            website: typedProfile.website || null,
            is_master_account: typedProfile.is_master_account
          });
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Erro ao carregar sessão:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsDevMode(true);
      console.log("App is running in development mode");
    }

    loadSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", event);
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        loadSession();
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false);
        setUser(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      await loadSession();
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: "mentor" | "client",
    company?: string,
    phone?: string,
    position?: string,
    bio?: string
  ) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: { user: authUser }, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            company,
            phone,
            position,
            bio
          }
        }
      });

      if (error) throw error;
      
      if (authUser) {
        await loadSession();
        return user as AuthUser;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user?.id);

      if (error) throw error;
      await loadSession();
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    } catch (error) {
      if (error instanceof Error) setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    isDevMode,
    error,
    login,
    logout,
    register,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
