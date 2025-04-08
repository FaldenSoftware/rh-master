
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
    const userMetadata = prepareUserMetadata(name, role, company, phone, position, bio);
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
      handleRegistrationError(error);
    }
    
    if (!data.user) {
      console.error("Nenhum usuário retornado do signUp");
      throw new Error("Falha ao criar usuário");
    }
    
    console.log("Usuário registrado no auth:", data);
    
    // Wait longer for the trigger to create the profile
    // This helps avoid race conditions with RLS policies
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Directly initialize a basic user object instead of querying the database immediately
    // This avoids potential RLS recursion during the initial registration flow
    const basicUser: AuthUser = {
      id: data.user.id,
      email: data.user.email || '',
      name: userMetadata.name,
      role: userMetadata.role,
      company: userMetadata.company,
      phone: userMetadata.phone,
      position: userMetadata.position,
      bio: userMetadata.bio
    };
    
    console.log("Retornando usuário básico após registro:", basicUser);
    return basicUser;
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
  company?: string,
  phone?: string,
  position?: string,
  bio?: string
): Record<string, any> => {
  const metadata: Record<string, any> = {
    name: name.trim(),
    role
  };
  
  // Add all additional fields to metadata
  if (company && company.trim() !== '') {
    metadata.company = company.trim();
  }
  
  if (phone && phone.trim() !== '') {
    metadata.phone = phone.trim();
  }
  
  if (position && position.trim() !== '') {
    metadata.position = position.trim();
  }
  
  if (bio && bio.trim() !== '') {
    metadata.bio = bio.trim();
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
  
  // Handle rate limiting errors more explicitly
  if (error.message.includes('For security purposes') || 
      error.message.toLowerCase().includes('rate limit') ||
      error.status === 429) {
    throw new Error("Por razões de segurança, aguarde alguns segundos antes de tentar novamente.");
  }
  
  throw new Error(`Erro ao registrar: ${error.message}`);
};

/**
 * Checks if a profile exists for the user after registration.
 * Now simplified to avoid potential RLS issues during registration.
 */
const ensureProfileExists = async (
  user: any,
  name: string,
  role: "mentor" | "client",
  company?: string
): Promise<AuthUser> => {
  console.log(`Verificando perfil para o usuário ${user.id} após registro.`);

  // Return a basic user object without querying the database
  // This avoids potential RLS recursion during registration
  return {
    id: user.id,
    email: user.email || '',
    name: name.trim(),
    role: role,
    company: company
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
    
    // Give the system some time before querying the profile
    // This helps prevent RLS recursion issues
    await new Promise(resolve => setTimeout(resolve, 2000));
    
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
        company: userMetadata.company,
        phone: userMetadata.phone,
        position: userMetadata.position,
        bio: userMetadata.bio
      };
    }
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return null;
  }
};
