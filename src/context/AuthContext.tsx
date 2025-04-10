import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  AuthState, 
  AuthUser, 
  getCurrentUser, 
  loginUser, 
  logoutUser, 
  registerUser 
} from "@/lib/auth";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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

    // IMPORTANTE: Configurar o listener de eventos auth ANTES de verificar a sessão atual
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
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
    
    // Depois de configurar o listener, verificar o usuário atual
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
      
      // Mensagens de erro mais amigáveis para problemas comuns
      let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Credenciais inválidas. Verifique seu email e senha.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Email não confirmado. Verifique sua caixa de entrada.";
        } else {
          errorMessage = error.message;
        }
      }
        
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
    company?: string,
    phone?: string,
    position?: string,
    bio?: string
  ): Promise<AuthUser | null> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));
    
    try {
      console.log("Registrando usuário via Context:", { email, name, role, company, phone, position, bio });
      
      if (!email || !password || !name) {
        throw new Error("Preencha todos os campos obrigatórios");
      }
      
      if (role === "mentor" && (!company || company.trim() === '')) {
        throw new Error("Empresa é obrigatória para mentores");
      }
      
      // Tentar registrar o usuário
      const user = await registerUser(
        email,
        password,
        name,
        role,
        company,
        phone,
        position,
        bio
      );
      
      if (!user) {
        console.error("Registro bem-sucedido mas usuário não encontrado");
        throw new Error("Falha no registro. Tente novamente.");
      }
      
      console.log("Registro bem-sucedido para o usuário:", user);
      
      // Atualizar o estado de autenticação
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
      
      // Redirecionar com base no papel do usuário
      if (user.role === "mentor") {
        navigate("/leader");
      } else {
        navigate("/client");
      }
      
      return user;
      
    } catch (error) {
      console.error("Erro ao registrar:", error);
      
      // Mensagens de erro mais amigáveis para problemas comuns
      let errorMessage = "Ocorreu um erro ao registrar. Tente novamente.";
      
      if (error instanceof Error) {
        if (error.message.includes("Email already registered")) {
          errorMessage = "Email já registrado. Faça login ou use outro email.";
        } else if (error.message.includes("Company is required for mentors")) {
          errorMessage = "Empresa é obrigatória para mentores.";
        } else if (error.message.includes("Database error saving new user")) {
          errorMessage = "Erro ao salvar usuário. Verifique se todos os campos estão preenchidos corretamente.";
        } else if (error.message.includes("violates row-level security policy")) {
          errorMessage = "Erro de segurança ao criar perfil. Tente novamente ou entre em contato com o suporte.";
        } else {
          errorMessage = error.message;
        }
      }
        
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      
      toast({
        variant: "destructive",
        title: "Erro ao registrar",
        description: errorMessage,
      });
      
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
