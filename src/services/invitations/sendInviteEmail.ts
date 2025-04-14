
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
      
      // Check if the error is related to API keys
      if (errorMsg.includes('API key') || 
          errorMsg.includes('Configuração de e-mail ausente') || 
          errorMsg.includes('ausente')) {
        console.error("Erro de configuração de API:", errorMsg);
        return { 
          success: false, 
          error: "Configuração de email ausente. Contate o administrador do sistema para configurar as chaves de API.",
          isApiKeyError: true
        };
      }
      
      // Check if the error is related to domain verification
      if (errorMsg.includes('domain') || 
          errorMsg.includes('verify') ||
          errorMsg.includes('validation_error')) {
        console.error("Erro de verificação de domínio:", errorMsg);
        return { 
          success: false, 
          error: "É necessário verificar um domínio para enviar emails.",
          isDomainError: true
        };
      }
      
      console.error("Erro do serviço de email:", errorMsg);
      return { success: false, error: errorMsg };
    }
    
    // Pass along the test mode information if it exists
    if (data.isTestMode) {
      return { 
        success: true,
        isTestMode: true,
        actualRecipient: data.actualRecipient,
        intendedRecipient: data.intendedRecipient
      };
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    
    // Check if the error is related to API keys
    if (error.message && 
        (error.message.includes('API key') || 
         error.message.includes('Configuração de e-mail') ||
         error.message.includes('ausente'))) {
      return { 
        success: false, 
        error: "Configuração de email ausente. Contate o administrador do sistema para configurar as chaves de API.",
        isApiKeyError: true
      };
    }
    
    // Check if the error is related to domain verification
    if (error.message && 
        (error.message.includes('domain') || 
         error.message.includes('verify') ||
         error.message.includes('validation_error'))) {
      return { 
        success: false, 
        error: "É necessário verificar um domínio para enviar emails.",
        isDomainError: true
      };
    }
    
    return { success: false, error: "Erro interno ao enviar email" };
  }
};
