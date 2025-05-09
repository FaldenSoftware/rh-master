
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "../authTypes";
import { getUserProfile } from "./userProfile";

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

export const logoutUser = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    // Authentication check
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
