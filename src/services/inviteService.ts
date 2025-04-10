
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
    
    // Chamar a função Edge do Supabase para enviar o e-mail
    const result = await supabase.functions.invoke('send-invite-email', {
      body: { 
        email, 
        code,
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
    
    // Verificar se a resposta contém os dados esperados
    // Verificar se result tem a propriedade data (pode não ter se vier do catch)
    const responseData = 'data' in result ? result.data : null;
    
    if (!responseData || typeof responseData !== 'object') {
      console.error("Resposta inválida da função Edge:", responseData);
      return { 
        success: false, 
        error: "Resposta inválida do servidor de email" 
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
