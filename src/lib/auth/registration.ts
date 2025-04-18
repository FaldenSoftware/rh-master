
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "../authTypes";
import { UserRegistrationData } from "./types";
import { getUserProfile } from "./userProfile";

export const registerUser = async ({
  email,
  password,
  name,
  role,
  company = "",
  phone = "",
  position = "",
  bio = ""
}: UserRegistrationData): Promise<AuthUser | null> => {
  try {
    console.log("Registering user with data:", { email, name, role, company, phone, position, bio });
    
    if (role === "mentor" && (!company || company.trim() === "")) {
      throw new Error("Company is required for mentors");
    }
    
    // Clean input data
    const cleanedName = name.trim();
    const cleanedCompany = company?.trim() || "";
    const cleanedPhone = phone?.trim() || "";
    const cleanedPosition = position?.trim() || "";
    const cleanedBio = bio?.trim() || "";
    
    // Register user with metadata
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
      
      if (error.message.includes("User already registered")) {
        throw new Error("Este email já está registrado. Tente fazer login.");
      }
      
      throw new Error(`Erro ao registrar: ${error.message}`);
    }

    if (!data.user) {
      console.error("User data not returned from signup");
      return null;
    }

    console.log("User registered successfully with ID:", data.user.id);
    
    // Add user role with retry mechanism
    if (role === "mentor") {
      let retries = 3;
      while (retries > 0) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert([{
            user_id: data.user.id,
            role: 'mentor'
          }]);

        if (!roleError) break;

        console.error(`Error adding mentor role (attempt ${4-retries}/3):`, roleError);
        retries--;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Wait for profile creation trigger
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Get created profile
    const userProfile = await getUserProfile(data.user.id);
    console.log("Retrieved user profile:", userProfile);
    
    return userProfile;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

