
import { SupabaseAPI } from '@/lib/supabase/api';
import { ErrorService } from './errorService';
import { z } from 'zod';
import { addDays } from 'date-fns';
import { AuthUser } from '@/lib/authTypes';

export const inviteSchema = z.object({
  email: z.string().email('Por favor, insira um email válido').toLowerCase(),
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').max(100, 'O nome deve ter no máximo 100 caracteres').trim(),
  mentor_id: z.string().uuid('ID de mentor inválido')
});

export type InviteData = z.infer<typeof inviteSchema>;

export interface InvitationResult {
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

import type { Database } from '@/integrations/supabase/types';
type InvitationCode = Database['public']['Tables']['invitation_codes']['Row'] & {
  mentor?: { name?: string }
};

export class InvitationService {
  static async checkEmailConfig(): Promise<{ configured: boolean; error?: string }> {
    try {
      const result = await SupabaseAPI.invokeFunction<{ configured: boolean; error?: string }>('check-email-config');
      return result;
    } catch (error) {
      ErrorService.logError('function_error', error, { function: 'check-email-config' });
      return { configured: false, error: ErrorService.getUserFriendlyMessage(error) };
    }
  }

  static async createInvitation(
    clientEmail: string,
    clientName: string,
    mentor: AuthUser | null
  ): Promise<InvitationResult> {
    try {
      if (!mentor || !mentor.id) {
        throw new Error('Mentor não autenticado');
      }
      
      const validatedData = inviteSchema.parse({
        email: clientEmail,
        name: clientName,
        mentor_id: mentor.id
      });
      
      const existingInvites = await SupabaseAPI.getMany<InvitationCode>('invitation_codes', {
        filters: {
          email: validatedData.email,
          mentor_id: validatedData.mentor_id
        },
        limit: 1
      });
      
      const expirationDate = addDays(new Date(), 7).toISOString();
      let inviteId: string;
      
      if (existingInvites.length > 0) {
        const existingInvite = existingInvites[0];
        await SupabaseAPI.update<InvitationCode>('invitation_codes', existingInvite.id, {
          is_used: false,
          expires_at: expirationDate
        });
        inviteId = existingInvite.id;
      } else {
        const code = Math.random().toString(36).substring(2, 10);
        const newInvite = await SupabaseAPI.insert<InvitationCode>('invitation_codes', {
          code,
          mentor_id: validatedData.mentor_id,
          email: validatedData.email,
          is_used: false,
          expires_at: expirationDate
        });
        inviteId = newInvite.id;
      }
      
      const emailResult = await this.sendInviteEmail(
        validatedData.email,
        validatedData.name,
        mentor.name
      );
      
      if (!emailResult.success) {
        ErrorService.logError('function_error', emailResult.errorDetails || emailResult.error, {
          function: 'send-invite-email',
          email: validatedData.email
        });
        
        if (emailResult.isApiKeyError) {
          return {
            success: false,
            error: 'Configuração de email ausente. Contate o administrador do sistema.',
            isApiKeyError: true,
            errorDetails: emailResult.errorDetails
          };
        }
        
        if (emailResult.isDomainError) {
          return {
            success: false,
            error: 'É necessário verificar um domínio para enviar emails.',
            isDomainError: true,
            errorDetails: emailResult.errorDetails
          };
        }
        
        return {
          success: false,
          error: emailResult.error || 'Erro ao enviar email',
          errorDetails: emailResult.errorDetails,
          isSmtpError: emailResult.isSmtpError,
          service: emailResult.service
        };
      }
      
      if (emailResult.isTestMode && emailResult.actualRecipient !== validatedData.email) {
        return {
          success: true,
          message: 'Convite criado com sucesso, mas o email foi enviado para o proprietário da conta (modo de teste)',
          isTestMode: true,
          actualRecipient: emailResult.actualRecipient,
          intendedRecipient: validatedData.email,
          service: emailResult.service
        };
      }
      
      return {
        success: true,
        message: 'Convite enviado com sucesso',
        service: emailResult.service
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationError = error.errors[0];
        ErrorService.logError('validation_error', error, {
          clientEmail,
          clientName,
          mentorId: mentor?.id
        });
        return {
          success: false,
          error: validationError.message
        };
      }
      
      ErrorService.logError('unknown_error', error, {
        clientEmail,
        clientName,
        mentorId: mentor?.id
      });
      
      return {
        success: false,
        error: ErrorService.getUserFriendlyMessage(error),
        errorDetails: error
      };
    }
  }

  private static async sendInviteEmail(
    clientEmail: string,
    clientName: string,
    mentorName?: string
  ): Promise<{
    success: boolean;
    error?: string;
    isTestMode?: boolean;
    actualRecipient?: string;
    errorDetails?: any;
    service?: string;
    isSmtpError?: boolean;
    isApiKeyError?: boolean;
    isDomainError?: boolean;
  }> {
    try {
      const result = await SupabaseAPI.invokeFunction<{
        success: boolean;
        error?: string;
        isTestMode?: boolean;
        actualRecipient?: string;
        errorDetails?: any;
        service?: string;
        isSmtpError?: boolean;
        isApiKeyError?: boolean;
        isDomainError?: boolean;
      }>('send-invite-email', {
        email: clientEmail,
        clientName: clientName || 'Cliente',
        mentorName: mentorName || 'Mentor',
        mentorCompany: 'RH Mentor Mastery',
        registerUrl: `https://rh-mentor-mastery.vercel.app/register?type=client&email=${encodeURIComponent(clientEmail)}`
      });
      
      return result;
    } catch (error) {
      ErrorService.logError('function_error', error, {
        function: 'send-invite-email',
        clientEmail,
        clientName
      });
      
      return {
        success: false,
        error: 'Erro interno ao enviar email',
        errorDetails: error,
        isSmtpError: Boolean(error.message?.includes('SMTP') || error.message?.includes('email'))
      };
    }
  }

  static async getInvitationsByMentor(mentorId: string): Promise<InvitationCode[]> {
    try {
      return await SupabaseAPI.getMany<InvitationCode>('invitation_codes', {
        filters: { mentor_id: mentorId },
        order: { column: 'created_at', ascending: false }
      });
    } catch (error) {
      ErrorService.logError('database_error', error, { mentorId });
      throw error;
    }
  }

  static async resendInvitation(
    inviteId: string,
    mentorId: string
  ): Promise<InvitationResult> {
    try {
      const invites = await SupabaseAPI.getMany<InvitationCode>('invitation_codes', {
        filters: {
          id: inviteId,
          mentor_id: mentorId
        },
        select: '*, mentor:mentor_id(name)'
      });
      
      if (invites.length === 0) {
        return {
          success: false,
          error: 'Convite não encontrado ou sem permissão'
        };
      }
      
      const invite = invites[0];
      
      await SupabaseAPI.update('invitation_codes', inviteId, {
        expires_at: addDays(new Date(), 7).toISOString(),
        is_used: false
      });
      
      const emailResult = await this.sendInviteEmail(
        invite.email,
        'Cliente',
        invite.mentor?.name
      );
      
      if (!emailResult.success) {
        return {
          success: false,
          error: emailResult.error || 'Erro ao reenviar email',
          errorDetails: emailResult.errorDetails,
          isSmtpError: emailResult.isSmtpError
        };
      }
      
      return {
        success: true,
        message: 'Convite reenviado com sucesso'
      };
    } catch (error) {
      ErrorService.logError('unknown_error', error, { inviteId, mentorId });
      return {
        success: false,
        error: ErrorService.getUserFriendlyMessage(error),
        errorDetails: error
      };
    }
  }
}
