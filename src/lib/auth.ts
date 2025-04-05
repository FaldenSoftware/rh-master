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
        mentor_id: profileResult.data.mentor_id
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
      mentor_id: data[0].mentor_id
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
    console.log("Iniciando registro de usuário:", { email, name, role, company });
    
    // Validate inputs rigorously
    if (!email || !email.includes('@') || !email.includes('.')) {
      throw new Error("Email inválido");
    }
    
    if (!password || password.length < 6) {
      throw new Error("Senha deve ter pelo menos 6 caracteres");
    }
    
    if (!name || name.trim() === '') {
      throw new Error("Nome é obrigatório");
    }
    
    // Validate company field for mentors at application level
    if (role === "mentor") {
      if (!company) {
        throw new Error("Empresa é obrigatória para mentores");
      }
      
      const companyTrimmed = company.trim();
      if (companyTrimmed === '') {
        throw new Error("Empresa é obrigatória para mentores");
      }
      
      // Use trimmed company value
      company = companyTrimmed;
    }
    
    // Prepare user metadata
    const userMetadata = {
      name: name.trim(),
      role,
      company
    };
    
    console.log("Registrando usuário com metadados:", userMetadata);
    
    // Step 1: Register user in auth service
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
    
    console.log("Usuário registrado no auth:", data);
    
    if (!data.user) {
      console.error("Nenhum usuário retornado do signUp");
      throw new Error("Falha ao criar usuário");
    }
    
    // Step 2: Check if profile was created by trigger
    // Wait up to 3 seconds to ensure profile was created
    let profileCreated = false;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (!profileCreated && attempts < maxAttempts) {
      attempts++;
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      
      // Check profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (!profileError && profileData) {
        profileCreated = true;
        console.log("Profile verified after registration:", profileData);
      } else {
        console.log(`Attempt ${attempts}: Profile not found yet`);
      }
    }
    
    // If profile wasn't created automatically, try to create it manually
    if (!profileCreated) {
      console.log("Profile not created automatically, creating profile manually");
      
      // Validate company field for mentors again
      if (role === "mentor" && (!company || company.trim() === '')) {
        throw new Error("Empresa é obrigatória para mentores");
      }
      
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          name: name.trim(),
          role,
          company
        });
      
      if (insertError) {
        console.error("Error creating profile manually:", insertError);
        
        if (insertError.message.includes('violates row-level security policy')) {
          console.warn("RLS error when creating profile. Trying again with login.");
          
          // Try to login and then create profile
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email, 
            password
          });
          
          if (!loginError) {
            // Try to create profile again after login
            const { error: retryError } = await supabase
              .from('profiles')
              .insert({
                id: data.user.id,
                name: name.trim(),
                role,
                company
              });
            
            if (retryError) {
              console.error("Error creating profile after login:", retryError);
              throw new Error(`Error creating profile: ${retryError.message}`);
            }
          }
        } else if (!insertError.message.includes('duplicate key value')) {
          // Ignore duplicate key error (means profile was already created by trigger)
          throw new Error(`Error creating profile: ${insertError.message}`);
        }
      }
    }
    
    // Confirm profile was created
    const { data: confirmedProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    console.log("Final profile status:", confirmedProfile);
    
    return {
      id: data.user.id,
      email: data.user.email || '',
      name: name.trim(),
      role,
      company
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
