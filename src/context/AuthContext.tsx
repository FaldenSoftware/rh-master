import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthState, AuthUser, getCurrentUser, loginUser, logoutUser, registerUser } from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string, role: "mentor" | "client", company?: string) => Promise<AuthUser | null>;
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
        console.error("Erro ao verificar usuário:", error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : "Erro ao verificar usuário",
        });
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
          // Use setTimeout para evitar recursão em callbacks
          setTimeout(async () => {
            try {
              const user = await getCurrentUser();
              console.log("User fetched after sign in:", user);
              
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
                error: error instanceof Error ? error.message : "Erro ao buscar perfil",
              }));
            }
          }, 0);
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out");
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
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log("Attempting login for:", email);
      const user = await loginUser(email, password);
      
      if (!user) {
        console.error("Login successful but user not found");
        throw new Error("Falha na autenticação. Usuário não encontrado.");
      }
      
      console.log("Login successful for user:", user);
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
      
      if (user.role === "mentor") {
        navigate("/leader");
      } else {
        navigate("/client");
      }
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Ocorreu um erro ao fazer login. Tente novamente.";
        
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description: errorMessage,
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
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Ocorreu um erro ao fazer logout. Tente novamente.";
        
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: errorMessage,
      });
    }
  };

  const register = async (
    email: string, 
    password: string, 
    name: string, 
    role: "mentor" | "client",
    company?: string
  ): Promise<AuthUser | null> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log("Registering user:", { email, name, role, company });
      const user = await registerUser(email, password, name, role, company);
      
      if (!user) {
        console.error("Registration successful but user not found");
        throw new Error("Falha no registro. Tente novamente.");
      }
      
      console.log("Registration successful for user:", user);
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
      
      if (user.role === "mentor") {
        navigate("/leader");
      } else {
        navigate("/client");
      }
      
      return user; // Return the user object to match the function signature
      
    } catch (error) {
      console.error("Erro ao registrar:", error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Ocorreu um erro ao registrar. Tente novamente.";
        
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      throw error;
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
