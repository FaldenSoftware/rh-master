
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import InviteFormFields from "./InviteFormFields";
import { createClientInvitation } from "@/services/invitations";
import InviteErrorAlert from "./invitation/InviteErrorAlert";
import InviteSuccessAlert from "./invitation/InviteSuccessAlert";
import InviteFormActions from "./invitation/InviteFormActions";

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
          <InviteSuccessAlert 
            message={inviteStatus.message}
            isTestMode={inviteStatus.isTestMode}
            actualRecipient={inviteStatus.actualRecipient}
            intendedRecipient={inviteStatus.intendedRecipient}
            clientEmail={clientEmail}
          />
          
          <InviteFormActions 
            onCancel={onCancel}
            onReset={handleReset}
            isSuccess={true}
          />
        </div>
      )}
      
      {inviteStatus?.success === false && (
        <InviteErrorAlert 
          error={inviteStatus.error}
          isApiKeyError={inviteStatus.isApiKeyError}
          isDomainError={inviteStatus.isDomainError}
        />
      )}
    </div>
  );
};

export default ClientInviteForm;
