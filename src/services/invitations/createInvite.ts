
import { supabase } from "@/integrations/supabase/client";
import { AuthUser } from "@/lib/authTypes";
import { addDays } from "date-fns";
import { sendInviteEmail } from "./sendInviteEmail";

interface InvitationResult {
  success: boolean;
  error?: string;
  errorDetails?: any;
  message?: string;
  isApiKeyError?: boolean;
  isDomainError?: boolean;
  isSmtpError?: boolean;
  isTestMode?: boolean;
  actualRecipient?: string;
  intendedRecipient?: string;
  service?: string;
}

/**
 * Creates an invitation for a new client and sends an email
 */
export const createClientInvitation = async (
  clientEmail: string,
  clientName: string,
  mentor: AuthUser | null
): Promise<InvitationResult> => {
  try {
    if (!mentor || !mentor.id) {
      throw new Error("Mentor não autenticado");
    }

    // Gerar convite
    const expirationDate = addDays(new Date(), 7).toISOString();
    
    // Verificar se já existe um convite para este email
    const { data: existingInvite, error: checkError } = await supabase
      .from('invitation_codes')
      .select('id')
      .eq('email', clientEmail)
      .eq('mentor_id', mentor.id)
      .maybeSingle();
      
    if (checkError) {
      console.error("Erro ao verificar convite existente:", checkError);
      return { success: false, error: "Erro ao verificar convite existente", errorDetails: checkError };
    }
    
    let inviteId;
    
    // Atualizar convite existente ou criar novo
    if (existingInvite) {
      const { error: updateError } = await supabase
        .from('invitation_codes')
        .update({
          is_used: false,
          expires_at: expirationDate
        })
        .eq('id', existingInvite.id);
        
      if (updateError) {
        console.error("Erro ao atualizar convite:", updateError);
        return { success: false, error: "Erro ao atualizar convite", errorDetails: updateError };
      }
      
      inviteId = existingInvite.id;
    } else {
      // Create new invitation with a generated code
      const code = Math.random().toString(36).substring(2, 10);
      const { data, error } = await supabase
        .from('invitation_codes')
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
        return { success: false, error: "Erro ao criar convite", errorDetails: error };
      }
      
      inviteId = data.id;
    }
    
    // Enviar email de convite
    const emailResult = await sendInviteEmail(clientEmail, clientName, mentor.name);
    
    if (!emailResult.success) {
      console.error("Erro ao enviar email:", emailResult);
      
      // Return a more specific error message about API keys if that's the issue
      if (emailResult.error && 
          (emailResult.error.includes('API key') || 
           emailResult.error.includes('Configuração de e-mail') || 
           emailResult.error.includes('ausente'))) {
        return { 
          success: false, 
          error: "Configuração de email ausente. Contate o administrador do sistema para configurar a chave de API do Resend.",
          isApiKeyError: true,
          errorDetails: emailResult.errorDetails
        };
      }
      
      // Check if the error is related to domain verification
      if (emailResult.isDomainError || 
          (emailResult.error && 
           (emailResult.error.includes('domínio') || 
            emailResult.error.includes('domain') ||
            emailResult.error.includes('verify') ||
            emailResult.error.includes('validation_error')))) {
        return { 
          success: false, 
          error: "É necessário verificar um domínio no sistema de email. Entre em contato com o administrador.",
          isDomainError: true,
          errorDetails: emailResult.errorDetails
        };
      }
      
      // Check if the error is related to SMTP configuration
      if (emailResult.isSmtpError || 
          (emailResult.error && 
           (emailResult.error.includes('SMTP') || 
            emailResult.error.includes('email') ||
            emailResult.error.includes('conexão') ||
            emailResult.error.includes('connection')))) {
        return { 
          success: false, 
          error: "Erro de configuração do servidor de email. Entre em contato com o administrador.",
          isSmtpError: true,
          errorDetails: emailResult.errorDetails,
          service: emailResult.service
        };
      }
      
      return { 
        success: false, 
        error: emailResult.error || "Erro ao enviar email",
        errorDetails: emailResult.errorDetails,
        isSmtpError: emailResult.isSmtpError,
        isDomainError: emailResult.isDomainError,
        service: emailResult.service
      };
    }
    
    // Check if in test mode and actual recipient is different from intended
    if (emailResult.isTestMode && emailResult.actualRecipient !== clientEmail) {
      return { 
        success: true, 
        message: "Convite criado com sucesso, mas o email foi enviado para o proprietário da conta de email (modo de teste)",
        isTestMode: true,
        actualRecipient: emailResult.actualRecipient,
        intendedRecipient: clientEmail,
        errorDetails: null,
        service: emailResult.service
      };
    }
    
    return { 
      success: true, 
      message: "Convite enviado com sucesso",
      errorDetails: null,
      service: emailResult.service
    };
    
  } catch (error) {
    console.error("Erro ao criar convite:", error);
    return { success: false, error: "Erro interno ao criar convite", errorDetails: error };
  }
};
