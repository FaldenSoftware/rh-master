
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser, AuthState, registerUser, loginUser, logoutUser, getCurrentUser, updateUserProfile } from "@/lib/auth";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (
    email: string, 
    password: string, 
    name: string, 
    role: "mentor" | "client", 
    company?: string,
    phone?: string,
    position?: string,
    bio?: string
  ) => Promise<AuthUser | null>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<{
    name: string;
    phone: string;
    position: string;
    company: string;
    bio: string;
    avatar_url: string;
  }>) => Promise<AuthUser | null>;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => null,
  register: async () => null,
  logout: async () => {},
  updateProfile: async () => null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  useEffect(() => {
    const initializeAuth = async () => {
      try {

        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log("Auth state changed:", event, session?.user?.id);
          
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              setTimeout(async () => {
                const user = await getCurrentUser();
                setState({
                  user,
                  isAuthenticated: !!user,
                  isLoading: false,
                  error: null,
                });
              }, 0);
            }
          } else if (event === 'SIGNED_OUT') {
            setState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
            window.location.href = "/";
          }
        });
        
        const user = await getCurrentUser();
        console.log("Initial auth state:", user);
        
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
        
        return () => {
          authListener.subscription.unsubscribe();
        };
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await loginUser(email, password);
      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
      return user;
    } catch (error) {
      console.error("Erro no login (AuthContext):", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao fazer login",
      });
      throw error;
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
  ): Promise<AuthUser | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await registerUser({
        email, 
        password, 
        name, 
        role, 
        company,
        phone,
        position,
        bio
      });
      
      setState({
        user,
        isAuthenticated: !!user,
        isLoading: false,
        error: null,
      });
      return user;
    } catch (error) {
      console.error("Erro no registro (AuthContext):", error);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao registrar",
      });
      throw error;
    }
  };

  const updateProfile = async (profileData: Partial<{
    name: string;
    phone: string;
    position: string;
    company: string;
    bio: string;
    avatar_url: string;
  }>): Promise<AuthUser | null> => {
    if (!state.user) {
      throw new Error("Usuário não autenticado");
    }
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const updatedUser = await updateUserProfile(state.user.id, profileData);
      
      setState({
        user: updatedUser,
        isAuthenticated: !!updatedUser,
        isLoading: false,
        error: null,
      });
      
      return updatedUser;
    } catch (error) {
      console.error("Erro ao atualizar perfil (AuthContext):", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao atualizar perfil",
      }));
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await logoutUser();
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Erro no logout (AuthContext):", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao fazer logout",
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
      }}
    >  
      {children}
    </AuthContext.Provider>
  );
};
