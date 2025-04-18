
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./authTypes";
import { getUserProfile } from "./userProfile";

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
    console.log("Registering user with data:", { email, name, role, company, phone, position, bio });
    
    // Validações adicionais
    if (role === "mentor" && (!company || company.trim() === "")) {
      throw new Error("Company is required for mentors");
    }
    
    // Verificar se o email já existe
    const { data: existingUser, error: existingUserError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      throw new Error("Este email já está cadastrado");
    }

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      throw existingUserError;
    }
    
    // Limpar dados
    const cleanedName = name.trim();
    const cleanedCompany = company?.trim() || "";
    const cleanedPhone = phone?.trim() || "";
    const cleanedPosition = position?.trim() || "";
    const cleanedBio = bio?.trim() || "";
    
    // Registrar usuário
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: cleanedName,
          role,
          company: cleanedCompany,
          phone: cleanedPhone,
          position: cleanedPosition,
          bio: cleanedBio
        }
      }
    });

    if (error) {
      console.error("Supabase signup error:", error);
      
      // Tratar erros específicos
      if (error.message.includes("User already exists")) {
        throw new Error("Este email já está registrado. Tente fazer login.");
      }
      
      throw new Error(error.message);
    }

    if (!data.user) {
      console.error("User data not returned from signup");
      return null;
    }

    console.log("User registered successfully with ID:", data.user.id);
    
    // Tentar adicionar função de usuário
    if (role === "mentor") {
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{
          user_id: data.user.id,
          role: 'mentor'
        }]);

      if (roleError) {
        console.error("Error adding mentor role:", roleError);
        // Não lançamos erro aqui para não interromper o registro
      }
    }
    
    // Aguardar um momento para garantir que a trigger tenha tempo de criar o perfil
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Buscar o perfil criado
    const userProfile = await getUserProfile(data.user.id);
    console.log("Retrieved user profile:", userProfile);
    
    return userProfile;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (email: string, password: string): Promise<AuthUser | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error("User not found");
    }

    return await getUserProfile(data.user.id);
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

/**
 * Login in dev mode (no authentication)
 */
export const devModeLogin = async (
  email: string,
  name: string,
  role: "mentor" | "client"
): Promise<AuthUser | null> => {
  try {
    // Create a mock user for development mode
    const mockUser: AuthUser = {
      id: `dev-${Date.now()}`,
      email,
      name,
      role,
      company: role === "mentor" ? "Dev Company" : "",
      phone: "",
      position: "",
      bio: "",
      createdAt: new Date().toISOString()
    };

    // Store in localStorage for persistence
    localStorage.setItem('devModeActive', 'true');
    localStorage.setItem('devModeUser', JSON.stringify(mockUser));
    
    console.log("DEV MODE: Logged in as", mockUser);
    
    return mockUser;
  } catch (error) {
    console.error("Error in dev mode login:", error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<void> => {
  try {
    // Check if in dev mode first
    if (localStorage.getItem('devModeActive') === 'true') {
      localStorage.removeItem('devModeActive');
      localStorage.removeItem('devModeUser');
      console.log("DEV MODE: Logged out");
      return;
    }

    // Regular logout
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

/**
 * Get the currently authenticated user
 */
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    // Check if in dev mode first
    if (localStorage.getItem('devModeActive') === 'true') {
      const devModeUser = localStorage.getItem('devModeUser');
      if (devModeUser) {
        console.log("DEV MODE: Getting current user");
        return JSON.parse(devModeUser) as AuthUser;
      }
    }

    // Regular authentication check
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      throw error;
    }
    
    if (!session || !session.user) {
      return null;
    }
    
    const userId = session.user.id;
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (
  userId: string,
  profileData: Partial<{
    name: string;
    phone: string;
    position: string;
    company: string;
    bio: string;
    avatar_url: string;
    cnpj: string;
    industry: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    website: string;
  }>
): Promise<AuthUser | null> => {
  try {
    // Check if in dev mode
    if (localStorage.getItem('devModeActive') === 'true') {
      const devModeUserStr = localStorage.getItem('devModeUser');
      if (devModeUserStr) {
        const devUser = JSON.parse(devModeUserStr) as AuthUser;
        const updatedUser = {
          ...devUser,
          ...profileData,
        };
        localStorage.setItem('devModeUser', JSON.stringify(updatedUser));
        console.log("DEV MODE: Updated user profile", updatedUser);
        return updatedUser;
      }
      return null;
    }

    // Regular user update
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', userId);

    if (error) {
      throw new Error(`Error updating profile: ${error.message}`);
    }

    // Return the updated user profile
    return await getUserProfile(userId);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
