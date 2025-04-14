
import React from "react";
import { CheckCircle, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface InviteSuccessAlertProps {
  message?: string;
  isTestMode?: boolean;
  actualRecipient?: string;
  intendedRecipient?: string;
  clientEmail: string;
}

const InviteSuccessAlert: React.FC<InviteSuccessAlertProps> = ({
  message,
  isTestMode,
  actualRecipient,
  intendedRecipient,
  clientEmail
}) => {
  return (
    <div className="space-y-4">
      <Alert className="bg-green-50 text-green-800 border-green-200">
        <CheckCircle className="h-4 w-4 mr-2" />
        <AlertTitle>Convite enviado com sucesso</AlertTitle>
        <AlertDescription>
          {isTestMode ? (
            <>
              Um email foi enviado para <strong>{actualRecipient}</strong> (modo de teste).<br/>
              <span className="text-amber-600">
                Nota: O email deveria ter sido enviado para {intendedRecipient},
                mas como você está em modo de teste, foi enviado para o proprietário da conta Resend.
              </span>
            </>
          ) : (
            <>Um email foi enviado para {clientEmail} com as instruções para registro.</>
          )}
        </AlertDescription>
      </Alert>
      
      {isTestMode && (
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
    </div>
  );
};

export default InviteSuccessAlert;
