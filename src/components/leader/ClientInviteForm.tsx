
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Copy, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { generateInvitationCode } from "@/lib/invitationCode";

interface ClientInviteFormProps {
  onCancel: () => void;
}

const ClientInviteForm = ({ onCancel }: ClientInviteFormProps) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [inviteCode, setInviteCode] = useState("");
  const { user } = useAuth();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      toast.success("Código copiado para a área de transferência");
    } catch (err) {
      toast.error("Erro ao copiar código");
      console.error("Falha ao copiar:", err);
    }
  };

  // Função para enviar e-mail de convite usando o edge function
  const sendInviteEmail = async (email: string, code: string) => {
    try {
      setIsSendingEmail(true);
      
      // Use the Supabase edge function to send the email
      const { data, error } = await supabase.functions.invoke('send-invite-email', {
        body: { 
          email, 
          code,
          clientName: clientName || undefined,
          mentorName: user?.name || 'Seu mentor',
          mentorCompany: user?.company || 'RH Mentor Mastery'
        }
      });
      
      if (error) {
        throw error;
      }
      
      console.log("Resultado do envio de email:", data);
      toast.success(`Instruções de registro enviadas para ${email}`);
      return true;
    } catch (error) {
      console.error("Erro ao enviar email:", error);
      toast.error("Não foi possível enviar o email de convite");
      return false;
    } finally {
      setIsSendingEmail(false);
    }
  };

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
    
    if (!user) {
      toast.error("Você precisa estar logado para convidar clientes");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a unique invitation code
      const code = generateInvitationCode();
      
      // Save the invitation code in the database
      const { error } = await supabase
        .from('invitation_codes')
        .insert({
          code,
          mentor_id: user.id,
          email: clientEmail,
          is_used: false,
          // Definir data de expiração para 7 dias a partir de agora
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        } as any);
      
      if (error) {
        throw error;
      }
      
      setInviteCode(code);
      toast.success(`Código de convite gerado para ${clientName}`);
      
      // Enviar email automaticamente após gerar o código
      await sendInviteEmail(clientEmail, code);
      
    } catch (error) {
      console.error("Erro ao gerar convite:", error);
      toast.error("Erro ao gerar convite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Convidar Novo Cliente</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {!inviteCode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clientName">Nome completo</Label>
            <Input
              id="clientName"
              placeholder="Digite o nome do cliente"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
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
            />
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Gerando..." : "Gerar Código de Convite"}
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Código de convite gerado!</h4>
            <p className="text-sm text-blue-700 mb-3">
              Compartilhe este código com o cliente para que ele possa se registrar:
            </p>
            <div className="flex items-center gap-2">
              <Input 
                value={inviteCode} 
                readOnly 
                className="text-md font-mono font-medium bg-white"
              />
              <Button 
                type="button" 
                size="icon" 
                variant="outline" 
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
            <h4 className="font-medium mb-2 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Enviar por email
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Instruções enviadas para: <span className="font-medium">{clientEmail}</span>
            </p>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={() => sendInviteEmail(clientEmail, inviteCode)}
              disabled={isSendingEmail}
            >
              {isSendingEmail ? (
                <>Enviando e-mail...</>
              ) : (
                <>Reenviar instruções por email</>
              )}
            </Button>
          </div>
          
          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Fechar
            </Button>
            <Button 
              type="button" 
              onClick={() => {
                setInviteCode("");
                setClientName("");
                setClientEmail("");
              }}
            >
              Gerar Novo Convite
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientInviteForm;
