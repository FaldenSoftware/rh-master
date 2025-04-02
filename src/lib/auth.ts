import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
}

export const getUserProfile = async (user: User): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return null;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      id: data.id,
      email: user.email || '',
      name: data.name,
      role: data.role,
      company: data.company
    };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
};

export const registerUser = async (
  email: string,
  password: string,
  userData: {
    name: string;
    role: string;
    company?: string;
  }
): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: userData.name,
          role: userData.role,
          company: userData.company
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
        name: userData.name,
        role: userData.role,
        company: userData.company
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};
