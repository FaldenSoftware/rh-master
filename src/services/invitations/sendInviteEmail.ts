
import { supabase } from "@/integrations/supabase/client";

/**
 * Envia um email de convite para um cliente
 */
export const sendInviteEmail = async (
  clientEmail: string, 
  clientName?: string, 
  mentorName?: string
): Promise<{
  success: boolean; 
  error?: string; 
  isTestMode?: boolean; 
  actualRecipient?: string;
  errorDetails?: any;
  service?: string;
  isSmtpError?: boolean;
  isDomainError?: boolean;
}> => {
  try {
    console.log(`Iniciando envio de email para ${clientEmail}`);
    
    // Obter a URL base do ambiente atual
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : 'https://rh-mentor-mastery.vercel.app';

    // Verificar configurações de email antes de tentar enviar
    const { data: configCheck, error: configError } = await supabase.functions.invoke('check-email-config');
    if (configError || !configCheck?.configured) {
      console.error("Configurações de email não disponíveis:", configError || configCheck?.message);
      return { 
        success: false, 
        error: "Configurações de email não disponíveis. Verifique as variáveis de ambiente SMTP no Supabase.",
        errorDetails: configError || configCheck,
        isSmtpError: true
      };
    }

    // Chamar a Edge Function para enviar o email
    const { data, error } = await supabase.functions.invoke('send-invite-email', {
      body: {
        email: clientEmail,
        clientName: clientName || 'Cliente',
        mentorName: mentorName || 'Mentor',
        mentorCompany: 'RH Mentor Mastery',
        // URL dinâmica baseada no ambiente atual
        registerUrl: `${baseUrl}/register?type=client&email=${encodeURIComponent(clientEmail)}`
      }
    });
    
    if (error) {
      console.error("Erro na edge function:", error);
      return { 
        success: false, 
        error: "Erro ao enviar email: " + error.message,
        errorDetails: error,
        isSmtpError: Boolean(error.message?.includes('SMTP') || error.message?.includes('email')),
        isDomainError: Boolean(error.message?.includes('domínio') || error.message?.includes('domain'))
      };
    }
    
    if (!data) {
      console.error("Resposta inválida da Edge Function (sem dados)");
      return {
        success: false,
        error: "Resposta inválida do servidor (sem dados de retorno)",
        errorDetails: { invalidResponse: true },
        isSmtpError: false,
        isDomainError: false
      };
    }

    if (!data.success) {
      const errorMsg = data?.error || "Resposta inválida do servidor";
      console.error("Erro detalhado:", data?.details || "Sem detalhes adicionais");
      
      // Determinar tipo de erro
      const isSmtpError = Boolean(
        data?.details?.isSmtpError || 
        data?.isSmtpError || 
        errorMsg.includes('SMTP') || 
        errorMsg.includes('email') ||
        errorMsg.includes('connection')
      );
      
      const isDomainError = Boolean(
        data?.details?.isDomainError || 
        data?.isDomainError || 
        errorMsg.includes('domínio') || 
        errorMsg.includes('domain') || 
        errorMsg.includes('verification')
      );
      
      return { 
        success: false, 
        error: errorMsg,
        errorDetails: data?.details,
        isSmtpError: isSmtpError,
        isDomainError: isDomainError
      };
    }
    
    console.log("Email enviado com sucesso:", data);
    
    // Include optional test mode properties if they exist in the response
    return { 
      success: true, 
      isTestMode: data.isTestMode, 
      actualRecipient: data.actualRecipient,
      errorDetails: null, 
      service: data.service,
      isSmtpError: false,
      isDomainError: false
    };
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return { 
      success: false, 
      error: "Erro interno ao enviar email",
      errorDetails: error,
      isSmtpError: Boolean(error.message?.includes('SMTP') || error.message?.includes('email')),
      isDomainError: Boolean(error.message?.includes('domínio') || error.message?.includes('domain'))
    };
  }
};
