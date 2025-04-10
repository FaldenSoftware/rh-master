
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Mail } from "lucide-react";
import { toast } from "sonner";

interface InviteCodeDisplayProps {
  inviteCode: string;
  clientEmail: string;
  onReset: () => void;
  onCancel: () => void;
  onSendEmail: (email: string, code: string) => Promise<boolean>;
}

const InviteCodeDisplay = ({
  inviteCode,
  clientEmail,
  onReset,
  onCancel,
  onSendEmail
}: InviteCodeDisplayProps) => {
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      toast.success("Código copiado para a área de transferência");
    } catch (err) {
      toast.error("Erro ao copiar código");
      console.error("Falha ao copiar:", err);
    }
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
    try {
      // Chamar a função de envio de e-mail e capturar o resultado
      const success = await onSendEmail(clientEmail, inviteCode);
      
      // Adicionar feedback visual adicional baseado no resultado
      if (success) {
        // Mostrar um indicador visual de sucesso
        const emailStatusElement = document.getElementById('email-status');
        if (emailStatusElement) {
          emailStatusElement.className = 'text-sm text-green-600 font-medium';
          emailStatusElement.textContent = 'Email enviado com sucesso!';
          
          // Resetar após 5 segundos
          setTimeout(() => {
            if (emailStatusElement) {
              emailStatusElement.className = 'text-sm text-gray-600';
              emailStatusElement.textContent = `Instruções enviadas para: ${clientEmail}`;
            }
          }, 5000);
        }
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
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
        <p id="email-status" className="text-sm text-gray-600 mb-3">
          Instruções enviadas para: <span className="font-medium">{clientEmail}</span>
        </p>
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={handleSendEmail}
          disabled={isSendingEmail}
        >
          {isSendingEmail ? "Enviando..." : "Reenviar instruções por email"}
        </Button>
      </div>
      
      <div className="pt-2 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Fechar
        </Button>
        <Button type="button" onClick={onReset}>
          Gerar Novo Convite
        </Button>
      </div>
    </div>
  );
};

export default InviteCodeDisplay;
