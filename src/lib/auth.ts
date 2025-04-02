
import { supabase } from "@/integrations/supabase/client";
import { Session, User } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: "mentor" | "client";
  company?: string;
  mentorId?: string; // Novo campo para clientes vinculados a um mentor
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Define o tipo para os dados do perfil retornados pela função RPC
type ProfileData = Database["public"]["Functions"]["get_profile_by_id"]["Returns"][0];

// Helper para fazer login com Supabase
export const loginUser = async (email: string, password: string): Promise<AuthUser> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Credenciais inválidas");
  }

  try {
    // Buscar dados do perfil do usuário usando a função security definer
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_profile_by_id', { user_id: data.user.id }) as {
        data: ProfileData[] | null,
        error: any
      };

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      throw new Error("Erro ao buscar perfil do usuário");
    }

    if (!profileData || profileData.length === 0) {
      throw new Error("Perfil de usuário não encontrado");
    }
    
    const profile = profileData[0];

    // Criar objeto AuthUser combinando dados do auth e do perfil
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || "",
      name: profile.name,
      role: profile.role as "mentor" | "client", // Type assertion para garantir tipo correto
      company: profile.company,
      mentorId: profile.mentor_id, // Adicionar o ID do mentor, se existir
    };

    return authUser;
  } catch (error) {
    console.error("Erro ao processar perfil:", error);
    throw new Error("Erro ao buscar perfil do usuário");
  }
};

// Helper para fazer logout com Supabase
export const logoutUser = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
};

// Helper para obter o usuário atual do Supabase
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return null;
  }
  
  try {
    // Buscar dados do perfil do usuário usando a função security definer
    const { data: profileData, error: profileError } = await supabase
      .rpc('get_profile_by_id', { user_id: session.user.id }) as {
        data: ProfileData[] | null,
        error: any
      };

    if (profileError) {
      console.error("Erro ao buscar perfil:", profileError);
      return null;
    }
    
    if (!profileData || profileData.length === 0) {
      return null;
    }
    
    const profile = profileData[0];
    
    // Criar objeto AuthUser combinando dados do auth e do perfil
    const authUser: AuthUser = {
      id: session.user.id,
      email: session.user.email || "",
      name: profile.name,
      role: profile.role as "mentor" | "client", // Type assertion para garantir tipo correto
      company: profile.company,
      mentorId: profile.mentor_id, // Adicionar o ID do mentor, se existir
    };
    
    return authUser;
  } catch (error) {
    console.error("Erro ao processar perfil do usuário atual:", error);
    return null;
  }
};

// Helper para registrar um novo usuário
export const registerUser = async (
  email: string, 
  password: string, 
  name: string, 
  role: "mentor" | "client",
  company?: string,
  mentorId?: string // Novo parâmetro para vincular cliente a um mentor
): Promise<AuthUser> => {
  // 1. Registrar o usuário na autenticação
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        company,
        mentor_id: mentorId // Incluir ID do mentor nos metadados, se fornecido
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Erro ao criar usuário");
  }

  // 2. Verificamos se o perfil já foi criado pelo trigger on_auth_user_created
  let profileData;
  
  // Tentar buscar o perfil algumas vezes, pois pode haver um pequeno atraso na criação
  for (let i = 0; i < 3; i++) {
    const { data: profiles, error: profileError } = await supabase
      .rpc('get_profile_by_id', { user_id: data.user.id }) as {
        data: ProfileData[] | null,
        error: any
      };
      
    if (profiles && profiles.length > 0) {
      profileData = profiles[0];
      break;
    }
    
    if (i < 2) {
      // Pequena pausa antes de tentar novamente
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  // Se ainda não temos o perfil, vamos confiar no trigger do banco de dados
  // e apenas retornar os dados que temos
  if (!profileData) {
    console.log("Perfil não encontrado após cadastro. Confiando no trigger do banco de dados.");
    
    // Criar objeto AuthUser com os dados disponíveis
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || "",
      name: name,
      role: role,
      company: company,
      mentorId: mentorId,
    };
    
    return authUser;
  }

  // 3. Criar objeto AuthUser com os dados do perfil
  const authUser: AuthUser = {
    id: data.user.id,
    email: data.user.email || "",
    name: profileData.name || name,
    role: profileData.role as "mentor" | "client" || role,
    company: profileData.company || company,
    mentorId: profileData.mentor_id || mentorId,
  };

  return authUser;
};

// Verificar se o usuário tem acesso a uma rota específica com base na função
export const hasAccess = (user: AuthUser | null, role: "mentor" | "client" | "any"): boolean => {
  if (!user) return false;
  if (role === "any") return true;
  return user.role === role;
};
