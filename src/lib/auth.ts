
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
  mentor_id?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const getUserProfile = async (user: User): Promise<AuthUser | null> => {
  try {
    // Primeiro tenta buscar o perfil do usuário
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      throw error;
    }
    
    if (!data) {
      console.error('Perfil não encontrado para o usuário:', user.id);
      return null;
    }
    
    // Verifica se os dados essenciais estão presentes
    if (!data.name || !data.role) {
      console.error('Dados de perfil incompletos:', data);
      
      // Tenta criar um perfil padrão se não houver um perfil completo
      const defaultProfile: AuthUser = {
        id: user.id,
        email: user.email || '',
        name: 'Usuário',
        role: 'client',
        company: data.company,
        mentor_id: data.mentor_id
      };
      
      return defaultProfile;
    }
    
    return {
      id: data.id,
      email: user.email || '',
      name: data.name,
      role: data.role,
      company: data.company,
      mentor_id: data.mentor_id
    };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    throw error;
  }
};

export const registerUser = async (
  email: string,
  password: string,
  name: string, 
  role: "mentor" | "client", 
  company?: string
): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          company
        }
      }
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email || '',
        name,
        role,
        company
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      throw error;
    }
    
    if (data.user) {
      try {
        const profile = await getUserProfile(data.user);
        return profile;
      } catch (profileError) {
        console.error('Erro ao buscar perfil após login:', profileError);
        
        // Fallback para um perfil básico se não conseguir buscar o perfil
        return {
          id: data.user.id,
          email: data.user.email || '',
          name: 'Usuário',
          role: 'client',
          company: undefined
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    if (data.session?.user) {
      try {
        return await getUserProfile(data.session.user);
      } catch (profileError) {
        console.error('Erro ao buscar perfil do usuário atual:', profileError);
        
        // Fallback para um perfil básico
        return {
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: 'Usuário',
          role: 'client',
          company: undefined
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
};

export const hasAccess = (user: AuthUser | null, requiredRole: "mentor" | "client" | "any"): boolean => {
  if (!user) return false;
  
  if (requiredRole === "any") return true;
  
  return user.role === requiredRole;
};
