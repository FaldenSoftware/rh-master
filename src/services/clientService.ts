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

    // Primeiro, tente usar a função RPC
    try {
      console.log("Tentando buscar clientes via RPC...");
      const { data: rpcData, error: rpcError } = await supabase.rpc('get_mentor_clients' as any, { mentor_id: mentorId });

      // Se a RPC funcionou, retorne os dados
      if (!rpcError) {
        console.log("RPC bem-sucedida, retornando dados...");
        return (rpcData as Profile[]) || [];
      }
      
      // Se chegou aqui, a RPC falhou. Vamos logar o erro e tentar o método alternativo
      console.error("Erro específico retornado pela RPC 'get_mentor_clients':", JSON.stringify(rpcError, null, 2));
      console.warn("A RPC falhou, tentando consulta direta à tabela...");
    } catch (rpcCatchError) {
      console.error("Exceção ao chamar a RPC:", rpcCatchError);
      console.warn("Exceção na chamada da RPC, tentando consulta direta à tabela...");
    }

    // Método alternativo: consulta direta à tabela profiles com filtro
    console.log("Executando consulta direta à tabela profiles...");
    const { data: directData, error: directError } = await supabase
      .from('profiles')
      .select('*')
      .eq('mentor_id', mentorId)
      .eq('role', 'client');

    if (directError) {
      console.error("Erro na consulta direta à tabela profiles:", JSON.stringify(directError, null, 2));
      throw new Error(`Erro ao buscar clientes: ${directError.message}`);
    }

    console.log(`Consulta direta retornou ${directData?.length || 0} registros.`);
    return directData || [];
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
