
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./authTypes";

/**
 * Retrieves user profile data from Supabase
 */
export const getUserProfile = async (user: User): Promise<AuthUser | null> => {
  try {
    console.log("Buscando perfil para usuário:", user.id);
    // First try to get user profile using SECURITY DEFINER function
    const { data, error } = await supabase
      .rpc('get_profile_by_id', { user_id: user.id });
    
    if (error) {
      console.error('Erro ao buscar perfil:', error);
      return await fetchProfileFallback(user);
    }
    
    if (!data || data.length === 0) {
      console.error('Perfil não encontrado para o usuário:', user.id);
      return await fetchProfileFallback(user);
    }
    
    console.log("Perfil encontrado:", data[0]);
    
    return mapProfileToAuthUser(data[0], user);
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
};

/**
 * Fallback method to fetch user profile directly from profiles table
 */
const fetchProfileFallback = async (user: User): Promise<AuthUser | null> => {
  try {
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
    return mapProfileToAuthUser(profileResult.data, user);
  } catch (error) {
    console.error('Erro no fallback para buscar perfil:', error);
    return null;
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
