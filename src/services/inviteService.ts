
import { supabase } from "@/integrations/supabase/client";
import { generateInvitationCode } from "@/lib/invitationCode";
import { AuthUser } from "@/lib/authTypes";

interface InviteResult {
  success: boolean;
  code?: string;
  error?: string;
}

export const generateInviteCode = async (
  clientEmail: string,
  user: AuthUser | null
): Promise<InviteResult> => {
  if (!user) {
    return { 
      success: false, 
      error: "Você precisa estar logado para convidar clientes" 
    };
  }
  
  try {
    // Generate a unique invitation code
    const code = generateInvitationCode();
    
    // Save the invitation code in the database
    const { error } = await supabase
      .from('invitation_codes')
      .insert({
        code,
        mentor_id: user.id,
        email: clientEmail,
        is_used: false,
        // Definir data de expiração para 7 dias a partir de agora
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      } as any);
    
    if (error) {
      console.error("Erro ao gerar convite:", error);
      throw error;
    }
    
    return { success: true, code };
  } catch (error) {
    console.error("Erro ao gerar convite:", error);
    return { 
      success: false, 
      error: "Erro ao gerar convite" 
    };
  }
};

interface SendEmailResult {
  success: boolean;
  message?: string;
  error?: string;
  service?: string;
  details?: any;
}

export const sendInviteEmail = async (
  email: string,
  code: string,
  clientName: string | undefined,
  user: AuthUser | null
): Promise<SendEmailResult> => {
  try {
    console.log(`Enviando e-mail para ${email} com código ${code}`);
    
    // Validar parâmetros
    if (!email || !code) {
      console.error("Parâmetros inválidos para envio de email", { email, code });
      return { 
        success: false, 
        error: "Email e código são obrigatórios para enviar o convite" 
      };
    }
    
    // Log important data for debugging
    console.log("Dados sendo enviados:", { 
      email, 
      code,
      clientName,
      mentorName: user?.name || 'Seu mentor',
      mentorCompany: user?.company || 'RH Mentor Mastery'
    });
    
    // Chamar a função Edge do Supabase para enviar o e-mail com retry em caso de falha
    const maxRetries = 2;
    let lastError = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          console.log(`Tentativa ${attempt} de enviar e-mail...`);
          // Espera curta entre tentativas
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
        
        const response = await supabase.functions.invoke('send-invite-email', {
          body: { 
            email, 
            code,
            clientName,
            mentorName: user?.name || 'Seu mentor',
            mentorCompany: user?.company || 'RH Mentor Mastery'
          }
        });
        
        // Verificar se houve erro na chamada da função
        if (response.error) {
          console.error(`Erro na tentativa ${attempt}:`, response.error);
          lastError = response.error;
          continue; // Tenta novamente
        }
        
        // Verificar se a resposta contém os dados esperados
        const responseData = response.data;
        
        if (!responseData || typeof responseData !== 'object') {
          console.error(`Resposta inválida na tentativa ${attempt}:`, responseData);
          lastError = { message: "Resposta inválida do servidor de email" };
          continue; // Tenta novamente
        }
        
        if (!responseData.success) {
          console.error(`Erro reportado pelo servidor na tentativa ${attempt}:`, responseData);
          lastError = responseData;
          continue; // Tenta novamente
        }
        
        // Sucesso! Registrar e retornar
        console.log('Resposta do envio de e-mail:', responseData);
        
        return { 
          success: true, 
          message: responseData.message || 'Email enviado com sucesso',
          service: responseData.service
        };
      } catch (invokeError) {
        console.error(`Exceção na tentativa ${attempt}:`, invokeError);
        
        lastError = {
          message: invokeError.message || 'Erro desconhecido ao chamar função Edge',
          details: invokeError
        };
      }
    }
    
    // Se chegou aqui, todas as tentativas falharam
    console.error("Todas as tentativas de envio falharam. Último erro:", lastError);
    
    return { 
      success: false, 
      error: lastError?.message || 'Falha ao enviar email após várias tentativas',
      details: lastError
    };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return { 
      success: false, 
      error: error?.message || "Falha ao enviar o email de convite. Tente novamente mais tarde."
    };
  }
};
