
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/lib/authTypes";

/**
 * Obtém a lista de clientes de um mentor usando RPC
 */
export const getMentorClients = async (mentorId: string) => {
  try {
    console.log(`Buscando clientes para o mentor: ${mentorId}`);
    
    // Tentativa 1: Usar a função RPC otimizada
    const { data: clientsData, error: rpcError } = await supabase
      .rpc('get_mentor_clients', {
        input_mentor_id: mentorId
      });

    if (rpcError) {
      console.warn("Erro ao buscar clientes via RPC:", rpcError);
      console.info("Tentando fallback 1: Busca direta na tabela profiles");
      
      // Fallback 1: Busca direta na tabela de perfis
      const { data: directData, error: directError } = await supabase
        .from('profiles')
        .select('*')
        .eq('mentor_id', mentorId)
        .eq('role', 'client');
      
      if (directError) {
        console.warn("Erro no fallback 1:", directError);
        console.info("Tentando fallback 2: Busca na tabela de relacionamento");
        
        // Para garantir compatibilidade com o código existente
        return [];
      }
      
      return directData;
    }
    
    return clientsData;
  } catch (error) {
    console.error("Todos os métodos de busca de clientes falharam", error);
    return [];
  }
};

/**
 * Obtém detalhes de um cliente específico
 */
export const getClientDetails = async (clientId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', clientId)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar detalhes do cliente:", error);
    throw error;
  }
};

/**
 * Remove um cliente (atualiza para não ter mentor)
 */
export const removeClient = async (clientId: string) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({
        mentor_id: null
      })
      .eq('id', clientId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao remover cliente:", error);
    throw error;
  }
};

/**
 * Atualiza os dados de um cliente
 */
export const updateClientProfile = async (clientId: string, data: Partial<AuthUser>) => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', clientId);
    
    if (error) {
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar perfil do cliente:", error);
    throw error;
  }
};

/**
 * Verifica se um usuário é mentor de outro
 */
export const isMentorOfClient = async (mentorId: string, clientId: string) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', clientId)
      .eq('mentor_id', mentorId)
      .single();
    
    if (error) {
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error("Erro ao verificar relação mentor-cliente:", error);
    return false;
  }
};
