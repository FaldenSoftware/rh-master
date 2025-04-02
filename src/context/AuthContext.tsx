
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, AuthUser, getCurrentUser, loginUser, logoutUser, registerUser } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: "mentor" | "client", company?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  // Verificar se há uma sessão ativa no carregamento da página
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setAuthState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: (error as Error).message,
        });
      }
    };

    // Configurar listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          // Usar setTimeout para evitar deadlock
          setTimeout(async () => {
            try {
              const user = await getCurrentUser();
              setAuthState({
                user,
                isAuthenticated: !!user,
                isLoading: false,
                error: null,
              });
            } catch (error) {
              console.error("Erro ao buscar perfil de usuário:", error);
              setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: (error as Error).message,
              }));
            }
          }, 0);
        } else if (event === "SIGNED_OUT") {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        }
      }
    );
    
    checkUser();
    
    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await loginUser(email, password);
      
      if (!user) {
        throw new Error("Falha na autenticação. Usuário não encontrado.");
      }
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.name}!`,
      });
      
      // Redirecionar com base na função
      if (user.role === "mentor") {
        navigate("/leader");
      } else {
        navigate("/client");
      }
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: (error as Error).message,
      });
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    
    try {
      await logoutUser();
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      toast({
        title: "Logout realizado com sucesso",
      });
      
      navigate("/");
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: (error as Error).message,
      });
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: "mentor" | "client",
    company?: string
  ) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await registerUser(email, password, name, role, company);
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      toast({
        title: "Registro realizado com sucesso",
        description: `Bem-vindo, ${user.name}!`,
      });
      
      // Redirecionar com base na função
      if (user.role === "mentor") {
        navigate("/leader");
      } else {
        navigate("/client");
      }
      
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: (error as Error).message,
      }));
      
      toast({
        variant: "destructive",
        title: "Erro ao registrar",
        description: (error as Error).message,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
