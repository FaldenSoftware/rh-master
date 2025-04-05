
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
  mentor_id?: string;
  phone?: string | null;
  position?: string | null;
  bio?: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export const getUserProfile = async (user: User): Promise<AuthUser | null> => {
  try {
    console.log("Buscando perfil para usuário:", user.id);
    // First try to get user profile using SECURITY DEFINER function
    const { data, error } = await supabase
      .rpc('get_profile_by_id', { user_id: user.id });
    
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      
      // Fallback: try to fetch directly from profiles table
      const profileResult = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileResult.error) {
        console.error('Erro no fallback para buscar perfil:', profileResult.error);
        return null;
      }
      
      if (!profileResult.data) {
        console.error('Perfil não encontrado para o usuário:', user.id);
        return null;
      }
      
      console.log("Perfil encontrado via fallback:", profileResult.data);
      return {
        id: user.id,
        email: user.email || '',
        name: profileResult.data.name || 'Usuário',
        role: profileResult.data.role || 'client',
        company: profileResult.data.company,
        mentor_id: profileResult.data.mentor_id,
        phone: profileResult.data.phone,
        position: profileResult.data.position,
        bio: profileResult.data.bio
      };
    }
    
    if (!data || data.length === 0) {
      console.error('Perfil não encontrado para o usuário:', user.id);
      return null;
    }
    
    console.log("Perfil encontrado:", data[0]);
    
    return {
      id: data[0].id,
      email: user.email || '',
      name: data[0].name || 'Usuário',
      role: data[0].role || 'client',
      company: data[0].company,
      mentor_id: data[0].mentor_id,
      phone: data[0].phone,
      position: data[0].position,
      bio: data[0].bio
    };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
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
    console.log("Iniciando registro de novo usuário:", { email, name, role, company });
    
    // Validações rigorosas
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new Error("Email inválido");
    }
    
    if (!password || password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }
    
    if (!name || name.trim() === '') {
      throw new Error("Nome é obrigatório");
    }
    
    // Validação especial para mentores
    if (role === "mentor" && (!company || company.trim() === '')) {
      throw new Error("Empresa é obrigatória para mentores");
    }
    
    // Metadados do usuário
    const userMetadata: Record<string, any> = {
      name: name.trim(),
      role
    };
    
    // Adicionar empresa apenas se for mentor ou se foi fornecido um valor
    if (role === "mentor") {
      if (!company || company.trim() === '') {
        throw new Error("Empresa é obrigatória para mentores");
      }
      userMetadata.company = company.trim();
    } else if (company && company.trim() !== '') {
      userMetadata.company = company.trim();
    }
    
    console.log("Metadados para registro:", userMetadata);
    
    // Passo 1: Registrar o usuário no serviço de autenticação
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata
      }
    });
    
    if (error) {
      console.error("Erro no signUp:", error);
      if (error.message.includes('User already registered')) {
        throw new Error("Email já registrado. Por favor, faça login ou use outro email.");
      }
      throw new Error(`Erro ao registrar: ${error.message}`);
    }
    
    if (!data.user) {
      console.error("Nenhum usuário retornado do signUp");
      throw new Error("Falha ao criar usuário");
    }
    
    console.log("Usuário registrado no auth:", data);
    
    // Aguardar para garantir que o trigger tenha tempo de executar
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Verificar se o perfil foi criado pelo trigger
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    // Se o perfil não foi criado, criar manualmente
    if (profileError || !profileData) {
      console.log("Perfil não encontrado após registro, criando manualmente");
      
      const profileInsert = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: name.trim(),
          role: role,
          company: role === "mentor" ? company?.trim() : null
        });
      
      if (profileInsert.error) {
        console.error("Erro ao inserir perfil manualmente:", profileInsert.error);
        throw new Error("Não foi possível criar seu perfil. Por favor, tente novamente.");
      }
      
      console.log("Perfil criado manualmente com sucesso");
    } else {
      console.log("Perfil já criado pelo trigger:", profileData);
    }
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: name.trim(),
      role,
      company: role === "mentor" ? company : undefined,
      phone: null,
      position: null,
      bio: null
    };
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    console.log("Tentando login para:", email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
    
    console.log("Login bem-sucedido:", data);
    
    if (data.user) {
      try {
        console.log("Buscando perfil após login");
        const profile = await getUserProfile(data.user);
        
        if (!profile) {
          console.warn("Perfil não encontrado após login, usando dados básicos");
          // Fallback para um perfil básico se não conseguir buscar o perfil
          const userMetadata = data.user.user_metadata || {};
          return {
            id: data.user.id,
            email: data.user.email || '',
            name: userMetadata.name || 'Usuário',
            role: userMetadata.role || 'client',
            company: userMetadata.company
          };
        }
        
        console.log("Perfil recuperado após login:", profile);
        return profile;
      } catch (profileError) {
        console.error('Erro ao buscar perfil após login:', profileError);
        
        // Fallback para um perfil básico se não conseguir buscar o perfil
        const userMetadata = data.user.user_metadata || {};
        return {
          id: data.user.id,
          email: data.user.email || '',
          name: userMetadata.name || 'Usuário',
          role: userMetadata.role || 'client',
          company: userMetadata.company
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
    console.log("Iniciando logout");
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
    console.log("Logout bem-sucedido");
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    console.log("Verificando sessão atual");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Erro ao obter sessão:", error);
      throw error;
    }
    
    if (data.session?.user) {
      console.log("Sessão encontrada para usuário:", data.session.user.id);
      try {
        return await getUserProfile(data.session.user);
      } catch (profileError) {
        console.error('Erro ao buscar perfil do usuário atual:', profileError);
        
        // Fallback para um perfil básico
        const userMetadata = data.session.user.user_metadata || {};
        return {
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: userMetadata.name || 'Usuário',
          role: userMetadata.role || 'client',
          company: userMetadata.company
        };
      }
    }
    
    console.log("Nenhuma sessão encontrada");
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
