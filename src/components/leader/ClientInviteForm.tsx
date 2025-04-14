
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import InviteFormFields from "./InviteFormFields";
import { createClientInvitation } from "@/services/inviteService";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertTriangle, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ClientInviteFormProps {
  onCancel: () => void;
}

const ClientInviteForm = ({ onCancel }: ClientInviteFormProps) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<{
    success?: boolean;
    message?: string;
    error?: string;
    isApiKeyError?: boolean;
    isDomainError?: boolean;
    isTestMode?: boolean;
    actualRecipient?: string;
    intendedRecipient?: string;
  } | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!clientName.trim() || !clientEmail.trim()) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      toast.error("Por favor, informe um email válido");
      return;
    }
    
    setIsSubmitting(true);
    setInviteStatus(null);
    
    try {
      // Mostrar toast de carregamento
      const loadingToast = toast.loading("Enviando convite...");
      
      const result = await createClientInvitation(clientEmail, clientName, user);
      
      // Remover toast de carregamento
      toast.dismiss(loadingToast);
      
      if (!result.success) {
        // Check if this is an API key configuration error
        const isApiKeyError = result.isApiKeyError || 
                            (result.error && (
                              result.error.includes("Configuração de email ausente") || 
                              result.error.includes("API key") ||
                              result.error.includes("ausente")));
                              
        // Check if this is a domain verification error
        const isDomainError = result.isDomainError || 
                            (result.error && (
                              result.error.includes("domínio") || 
                              result.error.includes("verify") ||
                              result.error.includes("verification")));
        
        // Exibir mensagem de erro mais detalhada
        const errorMsg = result.error || "Erro ao enviar convite";
        toast.error(errorMsg);
        setInviteStatus({
          success: false,
          error: errorMsg,
          isApiKeyError: isApiKeyError,
          isDomainError: isDomainError
        });
        console.error("Falha ao enviar convite:", errorMsg);
        return;
      }
      
      // Atualizar status e mostrar sucesso
      setInviteStatus({
        success: true,
        message: result.message || `Convite enviado com sucesso para ${clientName}`,
        isTestMode: result.isTestMode,
        actualRecipient: result.actualRecipient,
        intendedRecipient: result.intendedRecipient
      });
      
      toast.success(`Convite enviado para ${clientName}`);
      
    } catch (error) {
      console.error("Erro ao enviar convite:", error);
      // Mensagem de erro mais informativa
      const errorMessage = "Erro ao enviar convite. Verifique a conexão com o servidor e tente novamente.";
      
      toast.error(errorMessage);
      setInviteStatus({
        success: false,
        error: errorMessage
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setInviteStatus(null);
    setClientName("");
    setClientEmail("");
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Convidar Novo Cliente</h3>
      </div>
      
      {!inviteStatus?.success ? (
        <InviteFormFields 
          clientName={clientName}
          setClientName={setClientName}
          clientEmail={clientEmail}
          setClientEmail={setClientEmail}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={onCancel}
        />
      ) : (
        <div className="space-y-4">
          <Alert className="bg-green-50 text-green-800 border-green-200">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Convite enviado com sucesso</AlertTitle>
            <AlertDescription>
              {inviteStatus.isTestMode ? (
                <>
                  Um email foi enviado para <strong>{inviteStatus.actualRecipient}</strong> (modo de teste).<br/>
                  <span className="text-amber-600">
                    Nota: O email deveria ter sido enviado para {inviteStatus.intendedRecipient},
                    mas como você está em modo de teste, foi enviado para o proprietário da conta Resend.
                  </span>
                </>
              ) : (
                <>Um email foi enviado para {clientEmail} com as instruções para registro.</>
              )}
            </AlertDescription>
          </Alert>
          
          {inviteStatus.isTestMode && (
            <Alert className="bg-amber-50 text-amber-800 border-amber-200">
              <Info className="h-4 w-4 mr-2" />
              <AlertTitle>Modo de Teste do Resend</AlertTitle>
              <AlertDescription>
                <p>Para enviar emails para outros destinatários, você precisa verificar um domínio no Resend:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Acesse <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="underline">https://resend.com/domains</a></li>
                  <li>Adicione e verifique seu domínio</li>
                  <li>Atualize a configuração da função Edge no arquivo supabase/functions/send-invite-email/index.ts</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Fechar
            </Button>
            <Button type="button" onClick={handleReset}>
              Enviar Novo Convite
            </Button>
          </div>
        </div>
      )}
      
      {inviteStatus?.success === false && (
        <Alert className={`mt-4 ${inviteStatus.isDomainError ? 'bg-amber-50 text-amber-800 border-amber-200' : inviteStatus.isApiKeyError ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {inviteStatus.isDomainError ? (
            <AlertTriangle className="h-4 w-4 mr-2" />
          ) : inviteStatus.isApiKeyError ? (
            <AlertTriangle className="h-4 w-4 mr-2" />
          ) : (
            <XCircle className="h-4 w-4 mr-2" />
          )}
          <AlertTitle>
            {inviteStatus.isDomainError ? 'Domínio não verificado' : 
             inviteStatus.isApiKeyError ? 'Erro de configuração' : 
             'Erro ao enviar convite'}
          </AlertTitle>
          <AlertDescription>
            {inviteStatus.isDomainError ? (
              <>
                {inviteStatus.error}
                <p className="mt-2 text-sm">
                  Para enviar emails para qualquer destinatário, você precisa verificar um domínio no Resend:
                </p>
                <ol className="list-decimal list-inside mt-1 text-sm">
                  <li>Acesse <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="underline">https://resend.com/domains</a></li>
                  <li>Adicione e verifique seu domínio</li>
                  <li>Atualize a função Edge para usar seu domínio verificado</li>
                </ol>
              </>
            ) : inviteStatus.isApiKeyError ? (
              <>
                {inviteStatus.error}
                <p className="mt-2 text-sm">
                  O administrador do sistema precisa configurar a chave RESEND_API_KEY nas funções do Supabase.
                </p>
              </>
            ) : (
              inviteStatus.error
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ClientInviteForm;
