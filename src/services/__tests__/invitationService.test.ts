import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvitationService } from '../invitationService';
import { SupabaseAPI } from '@/lib/supabase/api';
import { ErrorService } from '../errorService';

vi.mock('@/lib/supabase/api', () => ({
  SupabaseAPI: {
    getMany: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    invokeFunction: vi.fn()
  }
}));

vi.mock('../errorService', () => ({
  ErrorService: {
    logError: vi.fn(),
    getUserFriendlyMessage: vi.fn()
  }
}));

describe('InvitationService', () => {
  const mockMentor = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Mentor Teste',
    email: 'mentor@example.com'
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('checkEmailConfig', () => {
    it('should return configuration status', async () => {
      vi.mocked(SupabaseAPI.invokeFunction).mockResolvedValue({
        configured: true
      });
      const result = await InvitationService.checkEmailConfig();
      expect(result).toEqual({ configured: true });
      expect(SupabaseAPI.invokeFunction).toHaveBeenCalledWith('check-email-config');
    });

    it('should handle errors', async () => {
      const mockError = new Error('Erro de teste');
      vi.mocked(SupabaseAPI.invokeFunction).mockRejectedValue(mockError);
      vi.mocked(ErrorService.getUserFriendlyMessage).mockReturnValue('Mensagem amigável');
      const result = await InvitationService.checkEmailConfig();
      expect(result).toEqual({ configured: false, error: 'Mensagem amigável' });
      expect(ErrorService.logError).toHaveBeenCalledWith(
        'function_error',
        mockError,
        { function: 'check-email-config' }
      );
    });
  });

  describe('createInvitation', () => {
    it('should create a new invitation when none exists', async () => {
      vi.mocked(SupabaseAPI.getMany).mockResolvedValue([]);
      vi.mocked(SupabaseAPI.insert).mockResolvedValue({
        id: 'new-invite-id',
        code: 'abc123',
        mentor_id: mockMentor.id,
        email: 'cliente@example.com',
        is_used: false,
        expires_at: expect.any(String)
      });
      vi.mocked(SupabaseAPI.invokeFunction).mockResolvedValue({
        success: true,
        service: 'GoDaddy'
      });
      const result = await InvitationService.createInvitation(
        'cliente@example.com',
        'Cliente Teste',
        mockMentor
      );
      expect(result).toEqual({
        success: true,
        message: 'Convite enviado com sucesso',
        service: 'GoDaddy'
      });
      expect(SupabaseAPI.getMany).toHaveBeenCalled();
      expect(SupabaseAPI.insert).toHaveBeenCalled();
      expect(SupabaseAPI.invokeFunction).toHaveBeenCalled();
    });

    it('should update existing invitation', async () => {
      vi.mocked(SupabaseAPI.getMany).mockResolvedValue([{
        id: 'existing-invite-id',
        code: 'abc123',
        mentor_id: mockMentor.id,
        email: 'cliente@example.com',
        is_used: true,
        expires_at: '2023-01-01T00:00:00.000Z'
      }]);
      vi.mocked(SupabaseAPI.update).mockResolvedValue({
        id: 'existing-invite-id',
        is_used: false,
        expires_at: expect.any(String)
      });
      vi.mocked(SupabaseAPI.invokeFunction).mockResolvedValue({
        success: true,
        service: 'GoDaddy'
      });
      const result = await InvitationService.createInvitation(
        'cliente@example.com',
        'Cliente Teste',
        mockMentor
      );
      expect(result).toEqual({
        success: true,
        message: 'Convite enviado com sucesso',
        service: 'GoDaddy'
      });
      expect(SupabaseAPI.getMany).toHaveBeenCalled();
      expect(SupabaseAPI.update).toHaveBeenCalled();
      expect(SupabaseAPI.invokeFunction).toHaveBeenCalled();
    });

    it('should handle email sending errors', async () => {
      vi.mocked(SupabaseAPI.getMany).mockResolvedValue([]);
      vi.mocked(SupabaseAPI.insert).mockResolvedValue({
        id: 'new-invite-id',
        code: 'abc123',
        mentor_id: mockMentor.id,
        email: 'cliente@example.com',
        is_used: false,
        expires_at: expect.any(String)
      });
      vi.mocked(SupabaseAPI.invokeFunction).mockResolvedValue({
        success: false,
        error: 'Erro ao enviar email',
        isSmtpError: true,
        errorDetails: { message: 'SMTP configuration error' }
      });
      const result = await InvitationService.createInvitation(
        'cliente@example.com',
        'Cliente Teste',
        mockMentor
      );
      expect(result).toEqual({
        success: false,
        error: 'Erro ao enviar email',
        errorDetails: { message: 'SMTP configuration error' },
        isSmtpError: true,
        service: undefined
      });
      expect(ErrorService.logError).toHaveBeenCalled();
    });
  });
});
