
import { supabase } from "@/integrations/supabase/client";

export const addSamyllaClient = async () => {
  try {
    // Buscar o ID do mentor Marcos Belmiro
    const { data: mentorData, error: mentorError } = await supabase
      .from('profiles')
      .select('id')
      .eq('name', 'Marcos Belmiro')
      .single();
    
    if (mentorError || !mentorData) {
      console.error("Erro ao encontrar mentor:", mentorError);
      return { success: false, error: "Mentor não encontrado" };
    }
    
    const mentorId = mentorData.id;
    
    // Verificar se o cliente já existe
    const { data: existingClient, error: clientError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'samybarreto@hotmail.com')
      .single();
    
    if (existingClient) {
      // Se o cliente já existe, apenas atualize o mentor_id
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ mentor_id: mentorId })
        .eq('id', existingClient.id);
        
      if (updateError) {
        console.error("Erro ao atualizar cliente:", updateError);
        return { success: false, error: "Erro ao atualizar cliente" };
      }
      
      return { success: true, message: "Cliente atualizado com sucesso" };
    }
    
    // Registrar o novo cliente
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'samybarreto@hotmail.com',
      password: '123456',
      options: {
        data: {
          name: 'Samylla',
          role: 'client'
        }
      }
    });
    
    if (authError || !authData.user) {
      console.error("Erro ao criar usuário:", authError);
      return { success: false, error: "Erro ao criar usuário" };
    }
    
    // Atualizar o mentor_id do cliente
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ mentor_id: mentorId })
      .eq('id', authData.user.id);
      
    if (updateError) {
      console.error("Erro ao vincular cliente ao mentor:", updateError);
      return { success: false, error: "Erro ao vincular cliente ao mentor" };
    }
    
    return { success: true, message: "Cliente adicionado com sucesso" };
  } catch (error) {
    console.error("Erro ao adicionar cliente:", error);
    return { success: false, error: "Erro interno ao adicionar cliente" };
  }
};
