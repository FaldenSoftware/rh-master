
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/lib/authTypes";

interface InviteResult {
  success: boolean;
  message?: string;
  error?: string;
  clientEmail?: string;
}

export const createClientInvitation = async (
  clientEmail: string,
  clientName: string | undefined,
  user: AuthUser | null
): Promise<InviteResult> => {
  if (!user) {
    return { 
      success: false, 
      error: "Você precisa estar logado para convidar clientes" 
    };
  }
  
  try {
    // Save the invitation in the database directly linked to the mentor
    const { error } = await supabase
      .from('invitation_codes')
      .insert({
        mentor_id: user.id,
        email: clientEmail,
        is_used: false,
        // Definir data de expiração para 7 dias a partir de agora
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      });
    
    if (error) {
      console.error("Erro ao criar convite:", error);
      throw error;
    }
    
    // Immediately try to send the email
    const emailResult = await sendInviteEmail(clientEmail, clientName, user);
    
    if (!emailResult.success) {
      return { 
        success: true, 
        message: "Convite criado, mas houve um problema ao enviar o email. Tente reenviar o email mais tarde.",
        error: emailResult.error,
        clientEmail
      };
    }
    
    return { 
      success: true, 
      message: "Convite criado e email enviado com sucesso!",
      clientEmail
    };
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    return { 
      success: false, 
      error: "Erro ao criar convite" 
    };
  }
};

interface SendEmailResult {
  success: boolean;
  message?: string;
  error?: string;
  service?: string;
}

export const sendInviteEmail = async (
  email: string,
  clientName: string | undefined,
  user: AuthUser | null
): Promise<SendEmailResult> => {
  try {
    console.log(`Enviando e-mail para ${email}`);
    
    // Validar parâmetros
    if (!email) {
      console.error("Parâmetros inválidos para envio de email", { email });
      return { 
        success: false, 
        error: "Email é obrigatório para enviar o convite" 
      };
    }
    
    // Log important data for debugging
    console.log("Dados sendo enviados:", { 
      email, 
      clientName,
      mentorName: user?.name || 'Seu mentor',
      mentorCompany: user?.company || 'RH Mentor Mastery'
    });
    
    // Chamar a função Edge do Supabase para enviar o e-mail
    const result = await supabase.functions.invoke('send-invite-email', {
      body: { 
        email, 
        clientName,
        mentorName: user?.name || 'Seu mentor',
        mentorCompany: user?.company || 'RH Mentor Mastery'
      }
    }).catch(invokeError => {
      // Capturar erros de invocação da função
      console.error("Exceção ao invocar função Edge:", invokeError);
      
      // Verificar se é um erro de status code
      if (invokeError.message && invokeError.message.includes('non-2xx status code')) {
        return { 
          error: { 
            message: 'Erro no servidor de email. Verifique se as chaves de API estão configuradas corretamente.'
          }
        };
      }
      
      return { 
        error: { 
          message: `Falha ao conectar com o servidor de email: ${invokeError.message || 'Erro desconhecido'}`
        }
      };
    });
    
    // Verificar se houve erro na chamada da função
    if (result.error) {
      console.error("Erro retornado pela função Edge:", result.error);
      return { 
        success: false, 
        error: result.error.message || 'Erro desconhecido ao enviar email'
      };
    }
    
    // Verificar se result tem a propriedade data (pode não ter se vier do catch)
    const responseData = 'data' in result ? result.data : null;
    
    if (!responseData || typeof responseData !== 'object') {
      console.error("Resposta inválida da função Edge:", responseData);
      return { 
        success: false, 
        error: "Resposta inválida do servidor de email" 
      };
    }
    
    // Verificar se a resposta indica sucesso ou erro
    // A Edge Function agora sempre retorna status 200, mas pode indicar erro no campo success
    if (responseData.success === false) {
      console.error("Erro reportado pela Edge Function:", responseData.error);
      return {
        success: false,
        error: responseData.error || "Falha ao enviar email. Verifique as configurações do servidor."
      };
    }
    
    // Registrar sucesso
    console.log('Resposta do envio de e-mail:', responseData);
    
    // Retornar resultado detalhado
    return { 
      success: true, 
      message: responseData.message || 'Email enviado com sucesso',
      service: responseData.service
    };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return { 
      success: false, 
      error: error?.message || "Falha ao enviar o email de convite. Tente novamente mais tarde."
    };
  }
};
