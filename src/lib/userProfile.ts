
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
        company: profileData.company || '',
        mentor_id: profileData.mentor_id || (profileData.role === 'mentor' ? user.id : null),
        phone: profileData.phone || '',
        position: profileData.position || '',
        bio: profileData.bio || '',
        // Include company-related fields
        cnpj: profileData.cnpj || '',
        industry: profileData.industry || '',
        address: profileData.address || '',
        city: profileData.city || '',
        state: profileData.state || '',
        zipCode: profileData.zipCode || '',
        website: profileData.website || ''
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
      company: userMetadata.company || '',
      mentor_id: userMetadata.role === 'mentor' ? user.id : userMetadata.mentor_id,
      phone: userMetadata.phone || '',
      position: userMetadata.position || '',
      bio: userMetadata.bio || '',
      // Include company-related fields in fallback
      cnpj: userMetadata.cnpj || '',
      industry: userMetadata.industry || '',
      address: userMetadata.address || '',
      city: userMetadata.city || '',
      state: userMetadata.state || '',
      zipCode: userMetadata.zipCode || '',
      website: userMetadata.website || ''
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
      company: userMetadata.company || '',
      mentor_id: userMetadata.role === 'mentor' ? user.id : userMetadata.mentor_id,
      phone: userMetadata.phone || '',
      position: userMetadata.position || '',
      bio: userMetadata.bio || '',
      // Include company-related fields in ultimate fallback
      cnpj: userMetadata.cnpj || '',
      industry: userMetadata.industry || '',
      address: userMetadata.address || '',
      city: userMetadata.city || '',
      state: userMetadata.state || '',
      zipCode: userMetadata.zipCode || '',
      website: userMetadata.website || ''
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
    company: profileData.company || '',
    mentor_id: profileData.mentor_id || (profileData.role === 'mentor' ? user.id : null),
    phone: profileData.phone || '',
    position: profileData.position || '',
    bio: profileData.bio || '',
    // Include company-related fields
    cnpj: profileData.cnpj || '',
    industry: profileData.industry || '',
    address: profileData.address || '',
    city: profileData.city || '',
    state: profileData.state || '',
    zipCode: profileData.zipCode || '',
    website: profileData.website || ''
  };
};
