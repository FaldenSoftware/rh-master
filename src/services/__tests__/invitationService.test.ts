
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InvitationService } from '../invitationService';
import { AuthUser } from '@/lib/authTypes';
import { SupabaseAPI } from '@/lib/supabase/api';

// Mock the SupabaseAPI
vi.mock('@/lib/supabase/api', () => ({
  SupabaseAPI: {
    getMany: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    invokeFunction: vi.fn()
  }
}));

describe('InvitationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  // Mock data and responses
  const mockMentor: AuthUser = {
    id: '123',
    name: 'Test Mentor',
    email: 'mentor@test.com',
    role: 'mentor',
    createdAt: '2023-01-01T00:00:00Z'
  };
  
  const mockInvite = {
    id: 'invite-123',
    code: 'abcdef',
    mentor_id: '123',
    email: 'client@test.com',
    is_used: false,
    expires_at: '2023-12-31T00:00:00Z',
    created_at: '2023-01-01T00:00:00Z'
  };
  
  it('should create a new invitation when none exists', async () => {
    // Mock no existing invites
    vi.mocked(SupabaseAPI.getMany).mockResolvedValue([]);
    
    // Mock insert response
    vi.mocked(SupabaseAPI.insert).mockResolvedValue(mockInvite);
    
    // Mock email sending successful response
    vi.mocked(SupabaseAPI.invokeFunction).mockResolvedValue({
      success: true,
      service: 'test-service'
    });
    
    const result = await InvitationService.createInvitation(
      'client@test.com',
      'Test Client',
      mockMentor
    );
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('sucesso');
    expect(SupabaseAPI.insert).toHaveBeenCalled();
  });
  
  it('should update an existing invitation when one exists', async () => {
    // Mock existing invite
    vi.mocked(SupabaseAPI.getMany).mockResolvedValue([mockInvite]);
    
    // Mock update response
    vi.mocked(SupabaseAPI.update).mockResolvedValue(mockInvite);
    
    // Mock email sending successful response
    vi.mocked(SupabaseAPI.invokeFunction).mockResolvedValue({
      success: true,
      service: 'test-service'
    });
    
    const result = await InvitationService.createInvitation(
      'client@test.com',
      'Test Client',
      mockMentor
    );
    
    expect(result.success).toBe(true);
    expect(result.message).toContain('sucesso');
    expect(SupabaseAPI.update).toHaveBeenCalled();
    expect(SupabaseAPI.insert).not.toHaveBeenCalled();
  });
  
  it('should handle email sending errors', async () => {
    // Mock no existing invites
    vi.mocked(SupabaseAPI.getMany).mockResolvedValue([]);
    
    // Mock insert response
    vi.mocked(SupabaseAPI.insert).mockResolvedValue(mockInvite);
    
    // Mock email sending error
    vi.mocked(SupabaseAPI.invokeFunction).mockResolvedValue({
      success: false,
      error: 'SMTP error',
      isSmtpError: true
    });
    
    const result = await InvitationService.createInvitation(
      'client@test.com',
      'Test Client',
      mockMentor
    );
    
    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(result.isSmtpError).toBe(true);
  });
});
