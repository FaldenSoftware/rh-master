
import { supabase } from "@/integrations/supabase/client";

export const getClientTestsForUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('client_tests')
      .select('*')
      .eq('client_id', userId);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching client tests:", error);
    return [];
  }
};

export const getTestInfoBatch = async (testIds: string[]) => {
  try {
    if (testIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('tests')
      .select('*')
      .in('id', testIds);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching test info batch:", error);
    return [];
  }
};

export const getTestResultsBatch = async (clientTestIds: string[]) => {
  try {
    if (clientTestIds.length === 0) return [];
    
    const { data, error } = await supabase
      .from('test_results')
      .select('*')
      .in('client_test_id', clientTestIds);
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching test results batch:", error);
    return [];
  }
};

export const getMentorClients = async (mentorId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('role', 'client');
      
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching mentor clients:", error);
    return [];
  }
};
