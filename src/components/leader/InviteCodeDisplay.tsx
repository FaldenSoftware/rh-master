
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
      await onSendEmail(clientEmail, inviteCode);
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
