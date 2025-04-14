import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./authTypes";
import { getUserProfile } from "./userProfile";

// Store the last registration attempt timestamp
let lastRegistrationAttempt = 0;
const MIN_REGISTRATION_INTERVAL = 30000; // 30 seconds in milliseconds

/**
 * Handles user registration
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string, 
  role: "mentor" | "client", 
  company?: string,
  phone?: string,
  position?: string,
  bio?: string
): Promise<AuthUser | null> => {
  try {
    console.log("Iniciando registro de novo usuário:", { email, name, role, company, phone, position, bio });
    
    // Check if we're attempting to register too quickly
    const now = Date.now();
    if (now - lastRegistrationAttempt < MIN_REGISTRATION_INTERVAL) {
      const remainingSeconds = Math.ceil((MIN_REGISTRATION_INTERVAL - (now - lastRegistrationAttempt)) / 1000);
      throw new Error(`Por razões de segurança, você só pode fazer uma nova tentativa após ${remainingSeconds} segundos.`);
    }
    
    // Update last attempt timestamp
    lastRegistrationAttempt = now;
    
    validateRegistrationData(email, password, name, role, company);
    
    // Prepare user metadata with ALL fields
    const userMetadata = {
      name: name.trim(),
      role,
      company: company?.trim(),
      phone: phone?.trim(),
      position: position?.trim(),
      bio: bio?.trim()
    };
    
    console.log("Metadados completos para registro:", userMetadata);
    
    // Register the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata
      }
    });
    
    if (error) {
      console.error("Erro no signUp:", error);
      handleRegistrationError(error);
    }
    
    if (!data.user) {
      console.error("Nenhum usuário retornado do signUp");
      throw new Error("Falha ao criar usuário");
    }
    
    console.log("Usuário registrado no auth:", data);
    
    // Wait longer for the trigger to create the profile
    // This helps avoid race conditions with RLS policies
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // For mentors, set their own ID as mentor_id (self-reference)
    if (role === "mentor") {
      try {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ mentor_id: data.user.id })
          .eq('id', data.user.id);
          
        if (updateError) {
          console.error("Erro ao definir mentor_id:", updateError);
        } else {
          console.log("mentor_id definido com sucesso para:", data.user.id);
        }
      } catch (mentorUpdateError) {
        console.error("Exceção ao definir mentor_id:", mentorUpdateError);
      }
    }
    
    // Directly create a profile in the profiles table as a backup
    try {
      const profileData = {
        id: data.user.id,
        name: name.trim(),
        role: role,
        company: company?.trim(),
        phone: phone?.trim(),
        position: position?.trim(),
        bio: bio?.trim(),
        mentor_id: role === "mentor" ? data.user.id : null
      };
      
      const { error: profileError } = await supabase.from('profiles').insert(profileData);
      
      if (profileError) {
        // If profile already exists, try to update it instead
        if (profileError.code === "23505") { // Unique violation error code
          const { error: updateError } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('id', data.user.id);
            
          if (updateError) {
            console.error("Erro ao atualizar perfil existente:", updateError);
          } else {
            console.log("Perfil atualizado com sucesso");
          }
        } else {
          console.error("Erro ao criar perfil manualmente:", profileError);
        }
      } else {
        console.log("Perfil criado manualmente com sucesso");
      }
    } catch (profileInsertError) {
      console.error("Exceção ao criar perfil manualmente:", profileInsertError);
    }
    
    // Fetch the profile to verify it was created
    try {
      const { data: profileData, error: profileQueryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileQueryError) {
        console.error("Erro ao verificar perfil:", profileQueryError);
      } else if (profileData) {
        console.log("Perfil encontrado após registro:", profileData);
      } else {
        console.error("Nenhum perfil encontrado após registro");
      }
    } catch (profileQueryException) {
      console.error("Exceção ao verificar perfil:", profileQueryException);
    }
    
    // Return a user object with complete data
    const authUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      name: name.trim(),
      role: role,
      company: company?.trim(),
      mentor_id: role === "mentor" ? data.user.id : null,
      phone: phone?.trim() || '',
      position: position?.trim() || '',
      bio: bio?.trim() || ''
    };
    
    console.log("Retornando usuário completo após registro:", authUser);
    return authUser;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

/**
 * Validates registration input data
 */
const validateRegistrationData = (
  email: string,
  password: string,
  name: string,
  role: "mentor" | "client",
  company?: string
): void => {
  if (!email || !email.includes('@') || !email.includes('.')) {
    throw new Error("Email inválido");
  }
  
  if (!password || password.length < 6) {
    throw new Error("Senha deve ter pelo menos 6 caracteres");
  }
  
  if (!name || name.trim() === '') {
    throw new Error("Nome é obrigatório");
  }
  
  if (role === "mentor" && (!company || company.trim() === '')) {
    throw new Error("Empresa é obrigatória para mentores");
  }
};

/**
 * Handles registration errors
 */
const handleRegistrationError = (error: any): never => {
  console.error("Erro no signUp:", error);
  
  if (error.message.includes('User already registered')) {
    throw new Error("Email já registrado. Por favor, faça login ou use outro email.");
  }
  
  // Handle rate limiting errors more explicitly
  if (error.message.includes('For security purposes') || 
      error.message.toLowerCase().includes('rate limit') ||
      error.status === 429) {
    throw new Error("Por razões de segurança, aguarde alguns segundos antes de tentar novamente.");
  }
  
  throw new Error(`Erro ao registrar: ${error.message}`);
};

/**
 * Handles user login
 */
export const loginUser = async (
  email: string,
  password: string
): Promise<AuthUser | null> => {
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
    
    if (!data.user) {
      return null;
    }
    
    return await fetchUserProfileAfterLogin(data.user);
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

/**
 * Developer mode login - bypasses authentication
 * Only for development purposes!
 */
export const devModeLogin = async (
  email: string,
  name: string,
  role: "mentor" | "client"
): Promise<AuthUser | null> => {
  try {
    console.log("DEV MODE LOGIN:", { email, name, role });
    
    // Create a mock user object
    const mockUser: AuthUser = {
      id: `dev-user-${Date.now()}`,
      email: email || 'dev@example.com',
      name: name || 'Dev User',
      role: role,
      company: role === 'mentor' ? 'Dev Company' : undefined,
      mentor_id: role === 'mentor' ? `dev-user-${Date.now()}` : undefined,
      phone: '000-000-0000',
      position: role === 'mentor' ? 'Developer' : 'Client',
      bio: 'Developer mode user'
    };
    
    console.log("DEV MODE: Creating mock user:", mockUser);
    
    // Store in localStorage for persistence
    localStorage.setItem('devModeUser', JSON.stringify(mockUser));
    localStorage.setItem('devModeActive', 'true');
    
    return mockUser;
  } catch (error) {
    console.error('Error in dev mode login:', error);
    return null;
  }
};

/**
 * Retrieves user profile after login, with fallback
 */
const fetchUserProfileAfterLogin = async (user: any): Promise<AuthUser | null> => {
  try {
    console.log("Buscando perfil após login");
    
    // Try to get profile directly from database
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
      
    if (profileError) {
      console.error("Erro ao buscar perfil diretamente:", profileError);
    } else if (profileData) {
      console.log("Perfil encontrado diretamente:", profileData);
      return {
        id: user.id,
        email: user.email || '',
        name: profileData.name || 'Usuário',
        role: profileData.role || 'client',
        company: profileData.company,
        mentor_id: profileData.mentor_id,
        phone: profileData.phone,
        position: profileData.position,
        bio: profileData.bio
      };
    }
    
    // Fallback to user metadata if profile not found
    console.warn("Perfil não encontrado, usando dados de metadata");
    const userMetadata = user.user_metadata || {};
    
    return {
      id: user.id,
      email: user.email || '',
      name: userMetadata.name || 'Usuário',
      role: userMetadata.role || 'client',
      company: userMetadata.company,
      phone: userMetadata.phone,
      position: userMetadata.position,
      bio: userMetadata.bio
    };
  } catch (error) {
    console.error('Erro ao buscar perfil após login:', error);
    
    // Ultimate fallback
    const userMetadata = user.user_metadata || {};
    return {
      id: user.id,
      email: user.email || '',
      name: userMetadata.name || 'Usuário',
      role: userMetadata.role || 'client',
      company: userMetadata.company,
      phone: userMetadata.phone,
      position: userMetadata.position,
      bio: userMetadata.bio
    };
  }
};

/**
 * Logs out the current user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    console.log("Iniciando logout");
    
    // Check if we're in dev mode
    if (localStorage.getItem('devModeActive') === 'true') {
      console.log("DEV MODE: Clearing dev mode user");
      localStorage.removeItem('devModeUser');
      localStorage.removeItem('devModeActive');
      
      // Force redirect to home page
      window.location.href = "/";
      
      console.log("Dev mode logout bem-sucedido");
      return;
    }
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Erro ao fazer logout:", error);
      throw error;
    }
    
    // Clear any local storage or session storage if needed
    // localStorage.removeItem('your-auth-key');
    
    // Force redirect to home page
    window.location.href = "/";
    
    console.log("Logout bem-sucedido");
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

/**
 * Gets the currently authenticated user
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    console.log("Verificando sessão atual");
    
    // Check if we're in dev mode
    if (localStorage.getItem('devModeActive') === 'true') {
      const devModeUser = localStorage.getItem('devModeUser');
      if (devModeUser) {
        console.log("DEV MODE: Returning stored user");
        return JSON.parse(devModeUser) as AuthUser;
      }
    }
    
    // Regular authentication flow
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Erro ao obter sessão:", error);
      throw error;
    }
    
    if (!data.session?.user) {
      console.log("Nenhuma sessão encontrada");
      return null;
    }
    
    console.log("Sessão encontrada para usuário:", data.session.user.id);
    
    try {
      // Try to get profile directly from database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.session.user.id)
        .single();
        
      if (profileError) {
        console.error("Erro ao buscar perfil diretamente:", profileError);
      } else if (profileData) {
        console.log("Perfil encontrado diretamente:", profileData);
        return {
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: profileData.name || 'Usuário',
          role: profileData.role || 'client',
          company: profileData.company || '',
          mentor_id: profileData.mentor_id || (profileData.role === 'mentor' ? data.session.user.id : null),
          phone: profileData.phone || '',
          position: profileData.position || '',
          bio: profileData.bio || ''
        };
      }
      
      // Fallback to user metadata
      console.error('Perfil não encontrado, usando dados de metadata');
      
      const userMetadata = data.session.user.user_metadata || {};
      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        name: userMetadata.name || 'Usuário',
        role: userMetadata.role || 'client',
        company: userMetadata.company || '',
        mentor_id: userMetadata.role === 'mentor' ? data.session.user.id : userMetadata.mentor_id,
        phone: userMetadata.phone || '',
        position: userMetadata.position || '',
        bio: userMetadata.bio || ''
      };
    } catch (profileError) {
      console.error('Erro ao buscar perfil do usuário atual:', profileError);
      
      const userMetadata = data.session.user.user_metadata || {};
      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        name: userMetadata.name || 'Usuário',
        role: userMetadata.role || 'client',
        company: userMetadata.company || '',
        mentor_id: userMetadata.role === 'mentor' ? data.session.user.id : userMetadata.mentor_id,
        phone: userMetadata.phone || '',
        position: userMetadata.position || '',
        bio: userMetadata.bio || ''
      };
    }
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
};
