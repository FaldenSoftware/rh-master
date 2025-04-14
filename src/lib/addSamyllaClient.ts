
import { supabase } from "@/integrations/supabase/client";

export const addSamyllaClient = async (
  email: string,
  name: string,
  mentorId: string
) => {
  try {
    // Check if email already exists in profiles
    const { data: existingUserData, error: queryError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();
    
    if (queryError) {
      console.error("Error checking existing user:", queryError);
      return { success: false, error: "Error checking if user already exists" };
    }

    // If user exists, return error
    if (existingUserData) {
      return { success: false, error: "Email already registered" };
    }

    // Create invitation in invitation_codes table
    const code = Math.random().toString(36).substring(2, 10);
    const { error: inviteError } = await supabase
      .from("invitation_codes")
      .insert([
        {
          email,
          code,
          mentor_id: mentorId,
          is_used: false
        }
      ]);

    if (inviteError) {
      console.error("Error creating invitation:", inviteError);
      return { success: false, error: "Failed to create invitation" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding client:", error);
    return { success: false, error: "Unknown error adding client" };
  }
};
