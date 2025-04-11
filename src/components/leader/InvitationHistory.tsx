
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Mail, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { sendInviteEmail } from '@/services/inviteService';
import { InvitationCode } from '@/types/models';

export const InvitationHistory = () => {
  const { user } = useAuth();
  const [sendingEmails, setSendingEmails] = useState<Record<string, boolean>>({});
  
  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['invitation-history'],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('invitation_codes')
        .select('*')
        .eq('mentor_id', user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Erro ao buscar histórico de convites:", error);
        toast.error("Erro ao carregar histórico de convites");
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id,
  });
  
  if (error) {
    console.error("Erro na query de convites:", error);
  }
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return "Data inválida";
    }
  };
  
  const handleResendInvite = async (inviteId: string, email: string) => {
    if (!user) return;
    
    try {
      setSendingEmails(prev => ({ ...prev, [inviteId]: true }));
      
      // Fix: Pass clientName as undefined and mentorName as user.name instead of user object
      const result = await sendInviteEmail(email, undefined, user.name);
      
      if (result.success) {
        toast.success(`E-mail de convite reenviado para ${email}`);
      } else {
        toast.error(`Erro ao reenviar convite: ${result.error}`);
      }
    } catch (error) {
      console.error("Erro ao reenviar convite:", error);
      toast.error("Erro ao reenviar convite");
    } finally {
      setSendingEmails(prev => ({ ...prev, [inviteId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Data de envio</TableHead>
            <TableHead>Expira em</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invitations && invitations.length > 0 ? (
            invitations.map((invitation: InvitationCode) => (
              <TableRow key={invitation.id}>
                <TableCell>{invitation.email}</TableCell>
                <TableCell>{formatDate(invitation.created_at)}</TableCell>
                <TableCell>{formatDate(invitation.expires_at)}</TableCell>
                <TableCell>
                  {invitation.is_used ? (
                    <span className="text-green-600 font-medium">Utilizado</span>
                  ) : (
                    <span className="text-amber-600 font-medium">Pendente</span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendInvite(invitation.id, invitation.email)}
                    disabled={sendingEmails[invitation.id]}
                  >
                    {sendingEmails[invitation.id] ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-1" />
                        Reenviar
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                Nenhum convite enviado ainda.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvitationHistory;
