
import { supabase } from "@/integrations/supabase/client";

/**
 * Sends an invitation email to a client
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
  errorDetails?: any;  // Ensure errorDetails is consistently defined in return type
}> => {
  try {
    console.log(`Iniciando envio de email para ${clientEmail}`);
    
    // Chamar a Edge Function para enviar o email
    const { data, error } = await supabase.functions.invoke('send-invite-email', {
      body: {
        email: clientEmail,
        clientName: clientName || 'Cliente',
        mentorName: mentorName || 'Mentor',
        mentorCompany: 'RH Mentor Mastery',
        // Adicionamos um token de convite para maior segurança e incluímos o email na URL
        registerUrl: `https://rh-mentor-mastery.vercel.app/register?type=client&email=${encodeURIComponent(clientEmail)}`
      }
    });
    
    if (error) {
      console.error("Erro na edge function:", error);
      return { 
        success: false, 
        error: "Erro ao enviar email: " + error.message,
        errorDetails: error
      };
    }
    
    if (!data || !data.success) {
      const errorMsg = data?.error || "Resposta inválida do servidor";
      console.error("Erro detalhado:", data?.details || "Sem detalhes adicionais");
      return { 
        success: false, 
        error: errorMsg,
        errorDetails: data?.details
      };
    }
    
    console.log("Email enviado com sucesso:", data);
    
    // Include optional test mode properties if they exist in the response
    return { 
      success: true, 
      isTestMode: data.isTestMode, 
      actualRecipient: data.actualRecipient,
      errorDetails: null // Adding errorDetails as null for successful responses
    };
  } catch (error: any) {
    console.error("Erro ao enviar email:", error);
    return { 
      success: false, 
      error: "Erro interno ao enviar email",
      errorDetails: error
    };
  }
};
