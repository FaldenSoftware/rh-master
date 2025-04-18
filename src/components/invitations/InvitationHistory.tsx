import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react";
import { format, isPast } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { sendInviteEmail } from "@/services/invitations";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface Invitation {
  id: string;
  code: string;
  email: string;
  is_used: boolean;
  created_at: string;
  expires_at: string;
}

export function InvitationHistory() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resendingId, setResendingId] = useState<string | null>(null);
  
  const loadInvitations = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("invitation_codes")
        .select("*")
        .eq("mentor_id", user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      setInvitations(data || []);
    } catch (error) {
      console.error("Erro ao carregar convites:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar convites",
        description: "Não foi possível carregar o histórico de convites.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadInvitations();
  }, [user?.id]);

  const handleResendInvite = async (invitation: Invitation) => {
    setResendingId(invitation.id);
    
    try {
      const { error: updateError } = await supabase
        .from("invitation_codes")
        .update({
          is_used: false,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("id", invitation.id);
        
      if (updateError) throw updateError;
      
      const result = await sendInviteEmail(invitation.email, "", user?.name);
      
      if (!result.success) {
        throw new Error(result.error || "Erro ao enviar email");
      }
      
      toast({
        title: "Convite reenviado",
        description: `Convite reenviado com sucesso para ${invitation.email}`,
      });
      
      loadInvitations();
    } catch (error) {
      console.error("Erro ao reenviar convite:", error);
      toast({
        variant: "destructive",
        title: "Erro ao reenviar convite",
        description: "Não foi possível reenviar o convite. Tente novamente.",
      });
    } finally {
      setResendingId(null);
    }
  };
  
  const getInvitationStatus = (invitation: Invitation) => {
    if (invitation.is_used) {
      return {
        label: "Aceito",
        variant: "success" as const,
        icon: CheckCircle,
        description: "O convite foi aceito e a conta foi criada",
      };
    }
    
    if (isPast(new Date(invitation.expires_at))) {
      return {
        label: "Expirado",
        variant: "destructive" as const,
        icon: XCircle,
        description: "O convite expirou e não pode mais ser usado",
      };
    }
    
    return {
      label: "Pendente",
      variant: "outline" as const,
      icon: Clock,
      description: "O convite foi enviado e está aguardando aceitação",
    };
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Histórico de Convites</CardTitle>
          <CardDescription>
            Acompanhe o status dos convites enviados
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={loadInvitations}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Atualizar
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <LoadingSpinner className="py-4" text="Carregando convites..." />
        ) : invitations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum convite enviado ainda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Data de Envio</TableHead>
                  <TableHead>Expira em</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => {
                  const status = getInvitationStatus(invitation);
                  const StatusIcon = status.icon;
                  
                  return (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">{invitation.email}</TableCell>
                      <TableCell>
                        {format(new Date(invitation.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        {format(new Date(invitation.expires_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center">
                                <Badge variant={status.variant} className="flex items-center">
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {status.label}
                                </Badge>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{status.description}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="text-right">
                        {!invitation.is_used && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResendInvite(invitation)}
                            disabled={resendingId === invitation.id}
                          >
                            {resendingId === invitation.id ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Enviando...
                              </>
                            ) : (
                              "Reenviar"
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
