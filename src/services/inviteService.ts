
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/lib/authTypes";
import { addDays } from "date-fns";

/**
 * Creates an invitation for a new client and sends an email
 */
export const createClientInvitation = async (
  clientEmail: string,
  clientName: string,
  mentor: AuthUser | null
) => {
  try {
    if (!mentor || !mentor.id) {
      throw new Error("Mentor não autenticado");
    }

    // Gerar convite (sem código já que não há mais necessidade)
    const expirationDate = addDays(new Date(), 7).toISOString();
    
    // Verificar se já existe um convite para este email
    const { data: existingInvite, error: checkError } = await supabase
      .from('invitations')
      .select('id')
      .eq('email', clientEmail)
      .eq('mentor_id', mentor.id)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error("Erro ao verificar convite existente:", checkError);
      return { success: false, error: "Erro ao verificar convite existente" };
    }
    
    let inviteId;
    
    // Atualizar convite existente ou criar novo
    if (existingInvite) {
      const { error: updateError } = await supabase
        .from('invitations')
        .update({
          is_used: false,
          expires_at: expirationDate
        })
        .eq('id', existingInvite.id);
        
      if (updateError) {
        console.error("Erro ao atualizar convite:", updateError);
        return { success: false, error: "Erro ao atualizar convite" };
      }
      
      inviteId = existingInvite.id;
    } else {
      // Create new invitation with a generated code
      const code = Math.random().toString(36).substring(2, 10);
      const { data, error } = await supabase
        .from('invitations')
        .insert({
          code,
          mentor_id: mentor.id,
          email: clientEmail,
          is_used: false,
          expires_at: expirationDate
        })
        .select('id')
        .single();
        
      if (error) {
        console.error("Erro ao criar convite:", error);
        return { success: false, error: "Erro ao criar convite" };
      }
      
      inviteId = data.id;
    }
    
    // Enviar email de convite
    const emailResult = await sendInviteEmail(clientEmail, clientName, mentor.name);
    
    if (!emailResult.success) {
      console.error("Erro ao enviar email:", emailResult.error);
      return { success: false, error: emailResult.error || "Erro ao enviar email" };
    }
    
    return { 
      success: true, 
      message: "Convite enviado com sucesso" 
    };
    
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    return { success: false, error: "Erro interno ao criar convite" };
  }
};

/**
 * Sends an invitation email to a client
 */
export const sendInviteEmail = async (
  clientEmail: string,
  clientName: string,
  mentorName: string
) => {
  try {
    // Chamar a Edge Function para enviar o email
    const { data, error } = await supabase.functions.invoke('send-invite-email', {
      body: {
        to: clientEmail,
        clientName,
        mentorName
      }
    });
    
    if (error) {
      console.error("Erro na edge function:", error);
      return { success: false, error: "Erro ao enviar email: " + error.message };
    }
    
    if (!data || !data.success) {
      const errorMsg = data?.error || "Resposta inválida do servidor";
      console.error("Erro do serviço de email:", errorMsg);
      return { success: false, error: errorMsg };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return { success: false, error: "Erro interno ao enviar email" };
  }
};
