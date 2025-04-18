
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { createClientInvitation } from "@/services/invitations/createInvite";
import { checkEmailConfig } from "@/services/emailConfigService";
import { useAuth } from "@/context/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { StatusAlert } from "@/components/ui/status-alert";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface InviteClientFormProps {
  onInviteSent?: () => void;
}

export function InviteClientForm({ onInviteSent }: InviteClientFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [isCheckingConfig, setIsCheckingConfig] = useState(true);

  useEffect(() => {
    const checkConfig = async () => {
      setIsCheckingConfig(true);
      try {
        const result = await checkEmailConfig();
        setIsConfigured(result.configured);
      } catch (error) {
        console.error("Erro ao verificar configuração:", error);
        setIsConfigured(false);
      } finally {
        setIsCheckingConfig(false);
      }
    };
    
    checkConfig();
  }, []);

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!clientEmail || !clientName) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Por favor, preencha o nome e email do cliente.",
      });
      return;
    }
    
    if (isConfigured === false) {
      toast({
        variant: "destructive",
        title: "Configuração incompleta",
        description: "O sistema de email não está configurado. Contate o administrador.",
      });
      return;
    }
    
    setIsSendingInvite(true);
    
    try {
      const result = await createClientInvitation(clientEmail, clientName, user);
      
      if (result.success) {
        toast({
          title: "Convite enviado",
          description: result.message || "Convite enviado com sucesso!",
        });
        setClientEmail("");
        setClientName("");
        if (onInviteSent) onInviteSent();
      } else {
        if (result.isSmtpError) {
          toast({
            variant: "destructive",
            title: "Erro de configuração",
            description: "Erro de configuração de email. Contate o administrador.",
          });
        } else if (result.isDomainError) {
          toast({
            variant: "destructive",
            title: "Domínio não verificado",
            description: "É necessário verificar um domínio para enviar emails.",
          });
        } else if (result.isApiKeyError) {
          toast({
            variant: "destructive",
            title: "Configuração ausente",
            description: "Configuração de email ausente. Contate o administrador.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao enviar convite",
            description: result.error || "Falha ao enviar convite.",
          });
        }
      }
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro inesperado. Tente novamente.",
      });
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Convidar Novo Cliente</CardTitle>
        <CardDescription>
          Envie um convite para um novo cliente se juntar à plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isCheckingConfig ? (
          <LoadingSpinner 
            size="md" 
            text="Verificando configuração..."
            className="py-4" 
          />
        ) : isConfigured === false ? (
          <StatusAlert
            status="error"
            title="Configuração Incompleta"
            description="O sistema de email não está configurado. Contate o administrador."
          />
        ) : null}
        
        <form onSubmit={handleSendInvite} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome do Cliente</Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Nome completo do cliente"
              disabled={isSendingInvite || isConfigured === false}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="clientEmail">Email do Cliente</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="cliente@exemplo.com"
              disabled={isSendingInvite || isConfigured === false}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSendingInvite || !clientName || !clientEmail || isConfigured === false}
          >
            {isSendingInvite ? (
              <>
                <LoadingSpinner size="sm" />
                <span className="ml-2">Enviando...</span>
              </>
            ) : (
              "Enviar Convite"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
