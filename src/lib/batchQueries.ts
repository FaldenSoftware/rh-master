
import { supabase } from "@/integrations/supabase/client";

// Safely get client tests for a specific user
export const getClientTestsForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .rpc('get_client_tests_for_user', { user_id: userId });

    if (error) {
      console.error("Error fetching client tests:", error);
      
      // Fallback to direct query if RPC fails
      const { data: directData, error: directError } = await supabase
        .from('client_tests')
        .select('*')
        .eq('client_id', userId);
        
      if (directError) {
        throw directError;
      }
      
      return directData;
    }

    return data;
  } catch (error) {
    console.error("Error in getClientTestsForUser:", error);
    throw error;
  }
};

// Fetch information about tests in batch
export const getTestInfoBatch = async (testIds: string[]) => {
  if (testIds.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .in('id', testIds);
      
    if (error) {
      console.error("Error fetching test info:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getTestInfoBatch:", error);
    throw error;
  }
};

// Fetch test results in batch
export const getTestResultsBatch = async (clientTestIds: string[]) => {
  if (clientTestIds.length === 0) return [];
  
  try {
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .in('client_test_id', clientTestIds);
      
    if (error) {
      console.error("Error fetching test results:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getTestResultsBatch:", error);
    throw error;
  }
};

// Get mentor clients
export const getMentorClients = async (mentorId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('role', 'client');
      
    if (error) {
      console.error("Error fetching mentor clients:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in getMentorClients:", error);
    throw error;
  }
};

// Create a default test
export const createDefaultTest = async (mentorId: string, title: string, description: string) => {
  try {
    const { data, error } = await supabase
      .from('tests')
      .insert([{ 
        mentor_id: mentorId,
        title,
        description
      }])
      .select('*')
      .single();
      
    if (error) {
      console.error("Error creating default test:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error in createDefaultTest:", error);
    throw error;
  }
};

// Assign test to client
export const assignTestToClient = async (clientId: string, testId: string) => {
  try {
    // Check if assignment already exists
    const { data: existingData, error: checkError } = await supabase
      .from('client_tests')
      .select('*')
      .eq('client_id', clientId)
      .eq('test_id', testId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking existing assignment:", checkError);
      throw checkError;
    }
    
    // If assignment doesn't exist, create it
    if (!existingData) {
      const { data, error } = await supabase
        .from('client_tests')
        .insert([{ 
          client_id: clientId,
          test_id: testId,
          is_completed: false
        }])
        .select('*')
        .single();
        
      if (error) {
        console.error("Error assigning test to client:", error);
        throw error;
      }
      
      return data;
    }
    
    return existingData;
  } catch (error) {
    console.error("Error in assignTestToClient:", error);
    throw error;
  }
};
