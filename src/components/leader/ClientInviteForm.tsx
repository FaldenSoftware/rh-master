
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import InviteFormFields from "./InviteFormFields";
import InviteCodeDisplay from "./InviteCodeDisplay";
import { generateInviteCode, sendInviteEmail } from "@/services/inviteService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ClientInviteFormProps {
  onCancel: () => void;
}

const ClientInviteForm = ({ onCancel }: ClientInviteFormProps) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const [inviteError, setInviteError] = useState<string | null>(null);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteError(null);
    
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
    
    try {
      const result = await generateInviteCode(clientEmail, user);
      
      if (!result.success) {
        setInviteError(result.error || "Erro ao gerar convite");
        toast.error(result.error || "Erro ao gerar convite");
        setIsSubmitting(false);
        return;
      }
      
      setInviteCode(result.code!);
      toast.success(`Código de convite gerado para ${clientName}`);
      
      // Enviar email automaticamente após gerar o código
      await handleSendEmail(clientEmail, result.code!);
      
    } catch (error) {
      console.error("Erro ao gerar convite:", error);
      setInviteError("Ocorreu um erro ao gerar o convite. Tente novamente.");
      toast.error("Erro ao gerar convite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = async (email: string, code: string) => {
    // Mostrar toast de carregamento
    const loadingToast = toast.loading("Enviando e-mail de convite...");
    
    try {
      // Chamar o serviço de envio de e-mail com tratamento de erro aprimorado
      const result = await sendInviteEmail(email, code, clientName, user);
      
      // Remover toast de carregamento
      toast.dismiss(loadingToast);
      
      if (result.success) {
        // Mostrar mensagem de sucesso com detalhes do serviço usado
        const serviceInfo = result.service ? ` via ${result.service}` : '';
        toast.success(`E-mail de convite enviado para ${email}${serviceInfo}`);
        return true;
      } else {
        // Mostrar mensagem de erro específica
        const errorMessage = result.error || "Falha ao enviar o email de convite. Tente novamente mais tarde.";
        toast.error(errorMessage);
        
        // Registrar detalhes adicionais no console para debugging
        if (result.details) {
          console.error("Detalhes do erro de envio:", result.details);
        }
        
        return false;
      }
    } catch (error) {
      // Remover toast de carregamento em caso de exceção
      toast.dismiss(loadingToast);
      
      // Mostrar erro genérico
      toast.error("Erro inesperado ao enviar o email. Tente novamente mais tarde.");
      console.error("Exceção ao enviar email:", error);
      return false;
    }
  };

  const handleReset = () => {
    setInviteCode("");
    setClientName("");
    setClientEmail("");
    setInviteError(null);
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Convidar Novo Cliente</h3>
      </div>
      
      {inviteError && (
        <Alert className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro ao processar convite</AlertTitle>
          <AlertDescription>{inviteError}</AlertDescription>
        </Alert>
      )}
      
      {!inviteCode ? (
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
        <InviteCodeDisplay 
          inviteCode={inviteCode}
          clientEmail={clientEmail}
          onReset={handleReset}
          onCancel={onCancel}
          onSendEmail={handleSendEmail}
        />
      )}
    </div>
  );
};

export default ClientInviteForm;
