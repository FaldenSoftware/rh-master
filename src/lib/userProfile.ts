
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "./authTypes";

/**
 * Retrieves user profile data from Supabase
 */
export const getUserProfile = async (userId: string): Promise<AuthUser | null> => {
  try {
    console.log("Buscando perfil para usuário:", userId);
    
    // Try direct query approach first - this avoids using RPC that could be causing recursion issues
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error("Erro ao buscar perfil diretamente:", profileError);
    } else if (profileData) {
      console.log("Perfil encontrado diretamente:", profileData);
      
      // Use a type assertion to help TypeScript understand profileData structure
      const typedProfileData = profileData as any;
      
      return {
        id: userId,
        email: typedProfileData.email || '',
        name: typedProfileData.name || 'Usuário',
        role: typedProfileData.role || 'client',
        company: typedProfileData.company || '',
        mentor_id: typedProfileData.mentor_id || (typedProfileData.role === 'mentor' ? userId : null),
        phone: typedProfileData.phone || '',
        position: typedProfileData.position || '',
        bio: typedProfileData.bio || '',
        createdAt: typedProfileData.created_at || new Date().toISOString(),
        avatar_url: typedProfileData.avatar_url || '',
        // Include company-related fields
        cnpj: typedProfileData.cnpj || '',
        industry: typedProfileData.industry || '',
        address: typedProfileData.address || '',
        city: typedProfileData.city || '',
        state: typedProfileData.state || '',
        zipCode: typedProfileData.zipCode || '',
        website: typedProfileData.website || ''
      };
    }
    
    // Fallback to get user metadata from auth API
    const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
    
    if (userError || !user) {
      console.error("Erro ao buscar usuário:", userError);
      return null;
    }
    
    const userMetadata = user.user_metadata || {};
    
    return {
      id: userId,
      email: user.email || '',
      name: userMetadata.name || 'Usuário',
      role: userMetadata.role || 'client',
      company: userMetadata.company || '',
      mentor_id: userMetadata.role === 'mentor' ? userId : userMetadata.mentor_id,
      phone: userMetadata.phone || '',
      position: userMetadata.position || '',
      bio: userMetadata.bio || '',
      createdAt: user.created_at || new Date().toISOString(),
      avatar_url: userMetadata.avatar_url || '',
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
    
    // Ultimate fallback - return minimal profile
    return {
      id: userId,
      email: '',
      name: 'Usuário',
      role: 'client',
      company: '',
      createdAt: new Date().toISOString(),
      mentor_id: '',
      phone: '',
      position: '',
      bio: '',
      avatar_url: '',
      // Include company-related fields in ultimate fallback
      cnpj: '',
      industry: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      website: ''
    };
  }
};

/**
 * Updates user profile data in Supabase
 */
export const updateUserProfile = async (profileData: Partial<AuthUser>): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("No authenticated user found");
      return false;
    }
    
    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', user.id);
      
    if (error) {
      console.error("Error updating profile:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    return false;
  }
};
