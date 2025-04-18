
import { supabase } from "@/integrations/supabase/client";

/**
 * Sends an invitation email to a client
 */
export const sendInviteEmail = async (
  clientEmail: string,
  clientName?: string,
  mentorName?: string
) => {
  try {
    // Chamar a Edge Function para enviar o email
    const { data, error } = await supabase.functions.invoke('send-invite-email', {
      body: {
        email: clientEmail,
        clientName: clientName || 'Cliente',
        mentorName: mentorName || 'Mentor',
        mentorCompany: 'RH Mentor Mastery'
      }
    });
    
    if (error) {
      console.error("Erro na edge function:", error);
      return { success: false, error: "Erro ao enviar email: " + error.message };
    }
    
    if (!data || !data.success) {
      const errorMsg = data?.error || "Resposta inválida do servidor";
      console.error("Erro detalhado:", data?.details || "Sem detalhes adicionais");
      return { success: false, error: errorMsg };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return { success: false, error: "Erro interno ao enviar email" };
  }
};
