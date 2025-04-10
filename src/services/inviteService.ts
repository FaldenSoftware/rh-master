
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
    const { data, error } = await supabase.functions.invoke('send-invite-email', {
      body: { 
        email, 
        code,
        clientName,
        mentorName: user?.name || 'Seu mentor',
        mentorCompany: user?.company || 'RH Mentor Mastery'
      }
    });
    
    if (error) {
      console.error("Erro retornado pela função Edge:", error);
      return { 
        success: false, 
        error: `Erro ao enviar email: ${error.message || 'Falha na comunicação com o servidor'}` 
      };
    }
    
    // Verificar se a resposta contém os dados esperados
    if (!data || typeof data !== 'object') {
      console.error("Resposta inválida da função Edge:", data);
      return { 
        success: false, 
        error: "Resposta inválida do servidor de email" 
      };
    }
    
    // Registrar sucesso
    console.log('Resposta do envio de e-mail:', data);
    
    // Retornar resultado detalhado
    return { 
      success: true, 
      message: data.message || 'Email enviado com sucesso',
      service: data.service
    };
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return { 
      success: false, 
      error: error?.message || "Falha ao enviar o email de convite. Tente novamente mais tarde."
    };
  }
};
