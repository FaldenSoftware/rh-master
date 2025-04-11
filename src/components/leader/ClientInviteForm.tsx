
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import InviteFormFields from "./InviteFormFields";
import InviteCodeDisplay from "./InviteCodeDisplay";
import { generateInviteCode, sendInviteEmail } from "@/services/inviteService";

interface ClientInviteFormProps {
  onCancel: () => void;
}

const ClientInviteForm = ({ onCancel }: ClientInviteFormProps) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
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
    
    try {
      // Mostrar toast de carregamento
      const loadingToast = toast.loading("Gerando código de convite...");
      
      const result = await generateInviteCode(clientEmail, user);
      
      // Remover toast de carregamento
      toast.dismiss(loadingToast);
      
      if (!result.success) {
        // Exibir mensagem de erro mais detalhada
        const errorMsg = result.error || "Erro ao gerar convite";
        toast.error(errorMsg);
        console.error("Falha ao gerar convite:", errorMsg);
        return;
      }
      
      setInviteCode(result.code!);
      toast.success(`Código de convite gerado para ${clientName}`);
      
      // Enviar email automaticamente após gerar o código
      await handleSendEmail(clientEmail, result.code!);
      
    } catch (error) {
      console.error("Erro ao gerar convite:", error);
      // Mensagem de erro mais informativa
      toast.error("Erro ao gerar convite. Verifique a conexão com o servidor e tente novamente.");
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
        // Verificar se o erro está relacionado à configuração do servidor
        let errorMessage = result.error || "Falha ao enviar o email de convite. Tente novamente mais tarde.";
        
        // Adicionar mensagem mais amigável para erros de configuração
        if (errorMessage.includes('API') || errorMessage.includes('configura') || errorMessage.includes('ausente')) {
          errorMessage = `${errorMessage} \n\nO código de convite foi gerado com sucesso, mas não foi possível enviar o email. Você pode copiar o código e enviá-lo manualmente.`;
        }
        
        toast.error(errorMessage);
        
        // Log detalhado do erro para debugging
        console.error("Detalhes do erro de envio:", result);
        return false;
      }
    } catch (error) {
      // Remover toast de carregamento em caso de exceção
      toast.dismiss(loadingToast);
      
      // Mostrar erro mais informativo
      toast.error("Erro inesperado ao enviar o email. O código foi gerado com sucesso, mas você precisará enviá-lo manualmente.");
      console.error("Exceção ao enviar email:", error);
      return false;
    }
  };

  const handleReset = () => {
    setInviteCode("");
    setClientName("");
    setClientEmail("");
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Convidar Novo Cliente</h3>
      </div>
      
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
