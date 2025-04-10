
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
      const result = await generateInviteCode(clientEmail, user);
      
      if (!result.success) {
        toast.error(result.error || "Erro ao gerar convite");
        return;
      }
      
      setInviteCode(result.code!);
      toast.success(`Código de convite gerado para ${clientName}`);
      
      // Enviar email automaticamente após gerar o código
      await handleSendEmail(clientEmail, result.code!);
      
    } catch (error) {
      console.error("Erro ao gerar convite:", error);
      toast.error("Erro ao gerar convite");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = async (email: string, code: string) => {
    const success = await sendInviteEmail(email, code, clientName, user);
    
    if (success) {
      toast.success(`E-mail de convite enviado para ${email}`);
    } else {
      toast.error("Falha ao enviar o email de convite. Tente novamente mais tarde.");
    }
    
    return success;
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
