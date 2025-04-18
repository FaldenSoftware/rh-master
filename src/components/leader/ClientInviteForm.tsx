
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { createClientInvitation } from "@/services/invitations";
import useNotifications from "@/hooks/useNotifications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const ClientInviteForm = ({ onCancel }: { onCancel: () => void }) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [configStatus, setConfigStatus] = useState<'checking' | 'configured' | 'not_configured'>('checking');
  
  const { user } = useAuth();
  const notify = useNotifications();

  // Verificar configuração de email ao carregar
  useEffect(() => {
    const checkEmailConfig = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-email-config');
        
        if (error || !data?.configured) {
          setConfigStatus('not_configured');
          setErrorMessage('Sistema de email não configurado. Contate o administrador.');
        } else {
          setConfigStatus('configured');
        }
      } catch (error) {
        console.error('Erro ao verificar configuração:', error);
        setConfigStatus('not_configured');
        setErrorMessage('Erro ao verificar configuração de email.');
      }
    };
    
    checkEmailConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (configStatus !== 'configured') {
      notify.error('Sistema de email não configurado. Contate o administrador.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      const result = await createClientInvitation(clientEmail, clientName, user);
      
      if (result.success) {
        notify.success(result.message || 'Convite enviado com sucesso!');
        setClientEmail('');
        setClientName('');
      } else {
        setErrorMessage(result.error || 'Erro ao enviar convite');
        
        // Feedback específico baseado no tipo de erro
        if (result.isSmtpError) {
          notify.error('Erro de configuração de email. Contate o administrador.');
        } else if (result.isDomainError) {
          notify.error('Domínio de email não verificado. Contate o administrador.');
        } else {
          notify.error('Falha ao enviar convite. Tente novamente mais tarde.');
        }
      }
    } catch (error: any) {
      console.error('Erro ao criar convite:', error);
      setErrorMessage('Erro interno ao processar convite');
      notify.error('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Convidar Novo Cliente</h3>
      </div>

      {configStatus === 'not_configured' && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Configuração Incompleta</AlertTitle>
          <AlertDescription>
            O sistema de email não está configurado. Contate o administrador para configurar as variáveis SMTP_USERNAME e SMTP_PASSWORD no Supabase.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Nome completo</Label>
          <Input
            id="clientName"
            placeholder="Digite o nome do cliente"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
            disabled={isSubmitting || configStatus !== 'configured'}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="clientEmail">Email</Label>
          <Input
            id="clientEmail"
            type="email"
            placeholder="cliente@empresa.com"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
            disabled={isSubmitting || configStatus !== 'configured'}
          />
        </div>
        
        {errorMessage && (
          <div className="text-red-500 text-sm">{errorMessage}</div>
        )}
        
        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting || configStatus !== 'configured'}
          >
            {isSubmitting && (
              <>Enviando...</>
            )}
            {!isSubmitting && "Enviar Convite"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ClientInviteForm;
