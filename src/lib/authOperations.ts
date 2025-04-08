
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./authTypes";
import { getUserProfile } from "./userProfile";

/**
 * Handles user registration
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string, 
  role: "mentor" | "client", 
  company?: string
): Promise<AuthUser | null> => {
  try {
    console.log("Iniciando registro de novo usuário:", { email, name, role, company });
    
    validateRegistrationData(email, password, name, role, company);
    
    // Prepare user metadata
    const userMetadata = prepareUserMetadata(name, role, company);
    console.log("Metadados para registro:", userMetadata);
    
    // Register the user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata
      }
    });
    
    if (error) {
      handleRegistrationError(error);
    }
    
    if (!data.user) {
      console.error("Nenhum usuário retornado do signUp");
      throw new Error("Falha ao criar usuário");
    }
    
    console.log("Usuário registrado no auth:", data);
    
    // Wait for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Validate and handle profile creation
    return await ensureProfileExists(data.user, name, role, company);
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
 * Prepares user metadata for registration
 */
const prepareUserMetadata = (
  name: string,
  role: "mentor" | "client",
  company?: string
): Record<string, any> => {
  const metadata: Record<string, any> = {
    name: name.trim(),
    role
  };
  
  if (role === "mentor") {
    metadata.company = company?.trim();
  } else if (company && company.trim() !== '') {
    metadata.company = company.trim();
  }
  
  return metadata;
};

/**
 * Handles registration errors
 */
const handleRegistrationError = (error: any): never => {
  console.error("Erro no signUp:", error);
  
  if (error.message.includes('User already registered')) {
    throw new Error("Email já registrado. Por favor, faça login ou use outro email.");
  }
  
  throw new Error(`Erro ao registrar: ${error.message}`);
};

/**
 * Checks if a profile exists for the user after registration.
 * Relies on the handle_new_user trigger for profile creation.
 */
const ensureProfileExists = async (
  user: any,
  name: string,
  role: "mentor" | "client",
  company?: string
): Promise<AuthUser> => {
  console.log(`Verificando perfil para o usuário ${user.id} após registro.`);

  // Give the trigger some time to execute
  await new Promise(resolve => setTimeout(resolve, 2000)); // Reduced delay slightly

  // Check if profile was created by trigger using the authenticated client
  // Note: This still might run into auth timing issues immediately after signup
  // but we are NOT attempting manual insert anymore.
  let profileData: any = null;
  let profileError: any = null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    profileData = data;
    profileError = error;
  } catch (err) {
      console.error("Erro inesperado ao buscar perfil:", err);
      profileError = err; // Catch potential exceptions during the query
  }


  // If profile not found after the delay, something went wrong (likely the trigger)
  if (profileError || !profileData) {
    console.error("Perfil não encontrado ou erro ao buscar após registro. Erro:", profileError);
    // Log the specific error if available
    const errorMessage = profileError?.message || "Perfil não encontrado após o tempo esperado.";
    // Throw a specific error indicating profile creation failed, likely due to the trigger
    throw new Error(`Não foi possível criar seu perfil. Verifique os logs do banco de dados. Detalhe: ${errorMessage}`);
  }

  console.log("Perfil encontrado (provavelmente criado pelo trigger):", profileData);

  // Return the AuthUser structure based on the found profile or initial data
  // It's safer to use data from the profile table if found
  return {
    id: user.id,
    email: user.email || '',
    name: profileData.name || name.trim(), // Prefer profile name
    role: profileData.role || role,         // Prefer profile role
    company: profileData.company,           // Get company from profile
    phone: profileData.phone,               // Get phone from profile
    position: profileData.position,         // Get position from profile
    bio: profileData.bio                    // Get bio from profile
  };
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
 * Retrieves user profile after login, with fallback
 */
const fetchUserProfileAfterLogin = async (user: any): Promise<AuthUser | null> => {
  try {
    console.log("Buscando perfil após login");
    const profile = await getUserProfile(user);
    
    if (profile) {
      console.log("Perfil recuperado após login:", profile);
      return profile;
    }
    
    // Fallback to metadata
    console.warn("Perfil não encontrado após login, usando dados básicos");
    const userMetadata = user.user_metadata || {};
    
    return {
      id: user.id,
      email: user.email || '',
      name: userMetadata.name || 'Usuário',
      role: userMetadata.role || 'client',
      company: userMetadata.company
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
      company: userMetadata.company
    };
  }
};

/**
 * Logs out the current user
 */
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

/**
 * Gets the currently authenticated user
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    console.log("Verificando sessão atual");
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
      return await getUserProfile(data.session.user);
    } catch (profileError) {
      // Fallback to metadata
      console.error('Erro ao buscar perfil do usuário atual:', profileError);
      
      const userMetadata = data.session.user.user_metadata || {};
      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        name: userMetadata.name || 'Usuário',
        role: userMetadata.role || 'client',
        company: userMetadata.company
      };
    }
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
};
