import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthUser } from '@/lib/authTypes';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDevMode?: boolean;  // Add this line
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDevMode, setIsDevMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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
            setUser({
              id: profile.id,
              email: profile.email,
              name: profile.name,
              role: profile.role,
              company: profile.company,
              phone: profile.phone,
              position: profile.position,
              bio: profile.bio,
              avatar_url: profile.avatar_url,
              createdAt: profile.created_at,
              mentor_id: profile.mentor_id,
              cnpj: profile.cnpj,
              industry: profile.industry,
              address: profile.address,
              city: profile.city,
              state: profile.state,
              zipCode: profile.zipCode,
              website: profile.website,
              is_master_account: profile.is_master_account,
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

    // Check if the app is running in a development environment
    if (import.meta.env.DEV) {
      setIsDevMode(true);
      console.log("App is running in development mode");
    }

    loadSession();

    // Listen for auth state changes
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Erro ao fazer login:", error);
        setIsAuthenticated(false);
        setUser(null);
      } else {
        console.log("Login bem-sucedido:", data);
        await loadSession();
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro ao fazer logout:", error);
      } else {
        console.log("Logout bem-sucedido");
        setIsAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      console.error("Erro durante o logout:", error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    isDevMode,
    login,
    logout,
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
