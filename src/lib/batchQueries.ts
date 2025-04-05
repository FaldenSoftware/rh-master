
import { supabase } from "@/integrations/supabase/client";

export const getClientTestsForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('client_tests')
    .select('*')
    .eq('client_id', userId);
    
  if (error) throw error;
  return data || [];
};

export const getTestInfoBatch = async (testIds: string[]) => {
  if (testIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from('tests')
    .select('*')
    .in('id', testIds);
    
  if (error) throw error;
  return data || [];
};

export const getTestResultsBatch = async (clientTestIds: string[]) => {
  if (clientTestIds.length === 0) return [];
  
  const { data, error } = await supabase
    .from('test_results')
    .select('*')
    .in('client_test_id', clientTestIds);
    
  if (error) throw error;
  return data || [];
};

export const getMentorClients = async (mentorId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('mentor_id', mentorId)
    .eq('role', 'client');
    
  if (error) throw error;
  return data || [];
};
