
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { sendInviteEmail } from "@/services/inviteService";

interface Invitation {
  id: string;
  email: string;
  created_at: string;
  is_used: boolean;
  mentor_id: string;
  used_by?: string;
  expires_at?: string;
}

const InvitationHistory = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState<Record<string, boolean>>({});
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchInvitations();
    }
  }, [user]);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      
      if (!user || !user.id) {
        throw new Error("Usuário não autenticado");
      }
      
      const { data, error } = await supabase
        .from('invitation_codes')
        .select('*')
        .eq('mentor_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setInvitations(data || []);
    } catch (error) {
      console.error("Erro ao buscar convites:", error);
      toast.error("Não foi possível carregar o histórico de convites");
    } finally {
      setLoading(false);
    }
  };

  const resendInviteEmail = async (email: string, inviteId: string) => {
    try {
      setSendingEmails(prev => ({ ...prev, [inviteId]: true }));
      
      const result = await sendInviteEmail(email, undefined, user);
      
      if (result.success) {
        toast.success(`E-mail de convite reenviado para ${email}`);
      } else {
        toast.error(`Falha ao reenviar e-mail: ${result.error || "Erro desconhecido"}`);
      }
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Não foi possível enviar o email de convite");
    } finally {
      setSendingEmails(prev => ({ ...prev, [inviteId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Carregando histórico de convites...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {invitations.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>Nenhum convite enviado ainda.</p>
          <p className="text-sm mt-2">Convide clientes para começar a usar a plataforma.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation.id}>
                <TableCell>{invitation.email}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(invitation.created_at), { 
                    addSuffix: true,
                    locale: ptBR
                  })}
                </TableCell>
                <TableCell>
                  {invitation.is_used ? (
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded-full text-xs">
                      Utilizado
                    </span>
                  ) : (
                    <span className="text-amber-600 bg-amber-50 px-2 py-1 rounded-full text-xs">
                      Pendente
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => resendInviteEmail(invitation.email, invitation.id)}
                      title="Reenviar email"
                      disabled={invitation.is_used || sendingEmails[invitation.id]}
                    >
                      {sendingEmails[invitation.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Mail className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={fetchInvitations}
        >
          Atualizar lista
        </Button>
      </div>
    </div>
  );
};

export default InvitationHistory;
