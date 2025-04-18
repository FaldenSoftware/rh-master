
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "../authTypes";

export const getUserProfile = async (userId: string): Promise<AuthUser | null> => {
  try {
    console.log("Buscando perfil para usuário:", userId);
    
    // Try direct query approach first
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
        avatar_url: typedProfileData.avatar_url || ''
      };
    }
    
    // Fallback to get user metadata from auth API
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
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
      avatar_url: userMetadata.avatar_url || ''
    };
  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    return null;
  }
};

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

