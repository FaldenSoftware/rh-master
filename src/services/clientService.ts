import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/profile";

/**
 * Busca todos os clientes associados a um mentor
 */
export const getMentorClients = async (mentorId: string): Promise<Profile[]> => {
  try {
    if (!mentorId) {
      throw new Error("ID do mentor não fornecido");
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('mentor_id', mentorId);
    if (error) {
      console.error("Erro ao buscar clientes:", error);
      throw new Error(`Erro ao buscar clientes: ${error.message}`);
    }
    return data || [];
  } catch (error: any) {
    console.error("Erro no serviço de clientes:", error);
    throw new Error(error.message || "Erro ao buscar clientes");
  }
};

/**
 * Busca um cliente específico pelo ID
 */
export const getClientById = async (clientId: string): Promise<Profile | null> => {
  try {
    if (!clientId) {
      throw new Error("ID do cliente não fornecido");
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', clientId)
      .single();
    if (error) {
      console.error("Erro ao buscar cliente:", error);
      throw new Error(`Erro ao buscar cliente: ${error.message}`);
    }
    return data;
  } catch (error: any) {
    console.error("Erro no serviço de clientes:", error);
    throw new Error(error.message || "Erro ao buscar cliente");
  }
};
