
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

export const sendInviteEmail = async (
  email: string,
  code: string,
  clientName: string | undefined,
  user: AuthUser | null
): Promise<boolean> => {
  try {
    console.log(`Enviando e-mail para ${email} com código ${code}`);
    
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
      throw error;
    }
    
    // Registrar sucesso
    console.log('Resposta do envio de e-mail:', data);
    return true;
  } catch (error) {
    console.error("Erro ao enviar email:", error);
    return false;
  }
};
