
import { InvitationService } from '@/services/invitationService';

// Update the resend method to match the correct signature
const handleResend = async (inviteId: string) => {
  try {
    const result = await InvitationService.resendInvitation(inviteId);
    if (result.success) {
      toast({
        title: 'Convite reenviado',
        description: result.message
      });
    }
  } catch (error) {
    toast({
      title: 'Erro',
      description: 'Falha ao reenviar convite',
      variant: 'destructive'
    });
  }
};
