
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./authTypes";

/**
 * Retrieves user profile data from Supabase
 */
export const getUserProfile = async (user: User): Promise<AuthUser | null> => {
  try {
    console.log("Buscando perfil para usuário:", user.id);
    
    // Try direct query approach first - this avoids using RPC that could be causing recursion issues
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
    
    // Fallback to user metadata if profile not found in database
    console.warn("Perfil não encontrado na base de dados, usando metadata do usuário");
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
    console.error('Erro ao buscar perfil:', error);
    
    // Ultimate fallback - use user metadata
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
 * Maps profile data to AuthUser object
 */
const mapProfileToAuthUser = (profileData: any, user: User): AuthUser => {
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
};
