
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Mail, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const [emailStatus, setEmailStatus] = useState<{
    sent: boolean;
    message?: string;
    error?: boolean;
  } | null>(null);

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
    setEmailStatus(null);
    
    try {
      // Chamar a função de envio de e-mail e capturar o resultado
      const success = await onSendEmail(clientEmail, inviteCode);
      
      if (success) {
        setEmailStatus({
          sent: true,
          message: "Email enviado com sucesso!"
        });
      } else {
        setEmailStatus({
          sent: false,
          message: "Falha ao enviar o email. Por favor, tente novamente ou use o código manualmente.",
          error: true
        });
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setEmailStatus({
        sent: false,
        message: "Ocorreu um erro ao tentar enviar o email.",
        error: true
      });
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
        <p className="text-sm text-gray-600 mb-3">
          Instruções enviadas para: <span className="font-medium">{clientEmail}</span>
        </p>
        
        {emailStatus && (
          <Alert 
            className={`mb-3 ${emailStatus.error ? 'bg-red-50 text-red-800 border-red-200' : 'bg-green-50 text-green-800 border-green-200'}`}
          >
            {emailStatus.error && <AlertCircle className="h-4 w-4 mr-2" />}
            <AlertTitle>Status do envio</AlertTitle>
            <AlertDescription>{emailStatus.message}</AlertDescription>
          </Alert>
        )}
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={handleSendEmail}
          disabled={isSendingEmail}
        >
          {isSendingEmail ? "Enviando..." : emailStatus?.sent ? "Reenviar instruções" : "Enviar instruções por email"}
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
