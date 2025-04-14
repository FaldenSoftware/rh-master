
import { supabase } from "@/integrations/supabase/client";

export const addSamyllaClient = async (
  email: string,
  name: string,
  mentorId: string
) => {
  try {
    // Check if email already exists in profiles
    const { data: existingUser, error: queryError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    
    if (queryError) {
      console.error("Error checking existing user:", queryError);
      return { success: false, error: "Error checking if user already exists" };
    }

    // If user exists, return error
    if (existingUser) {
      return { success: false, error: "Email already registered" };
    }

    // Create invitation
    const { error: inviteError } = await supabase
      .from("clients")
      .insert([
        {
          email,
          name,
          mentor_id: mentorId,
          status: "pending"
        }
      ]);

    if (inviteError) {
      console.error("Error creating client:", inviteError);
      return { success: false, error: "Failed to create client" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding client:", error);
    return { success: false, error: "Unknown error adding client" };
  }
};
