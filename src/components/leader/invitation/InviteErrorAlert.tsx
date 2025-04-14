
import React from "react";
import { XCircle, AlertTriangle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface InviteErrorAlertProps {
  error?: string;
  isApiKeyError?: boolean;
  isDomainError?: boolean;
}

const InviteErrorAlert: React.FC<InviteErrorAlertProps> = ({ 
  error, 
  isApiKeyError, 
  isDomainError 
}) => {
  if (!error) return null;
  
  return (
    <Alert 
      className={`mt-4 ${isDomainError ? 'bg-amber-50 text-amber-800 border-amber-200' : 
                          isApiKeyError ? 'bg-yellow-50 text-yellow-800 border-yellow-200' : 
                          'bg-red-50 text-red-800 border-red-200'}`}
    >
      {isDomainError ? (
        <AlertTriangle className="h-4 w-4 mr-2" />
      ) : isApiKeyError ? (
        <AlertTriangle className="h-4 w-4 mr-2" />
      ) : (
        <XCircle className="h-4 w-4 mr-2" />
      )}
      <AlertTitle>
        {isDomainError ? 'Domínio não verificado' : 
         isApiKeyError ? 'Erro de configuração' : 
         'Erro ao enviar convite'}
      </AlertTitle>
      <AlertDescription>
        {isDomainError ? (
          <>
            {error}
            <p className="mt-2 text-sm">
              Para enviar emails para qualquer destinatário, você precisa verificar um domínio no Resend:
            </p>
            <ol className="list-decimal list-inside mt-1 text-sm">
              <li>Acesse <a href="https://resend.com/domains" target="_blank" rel="noopener noreferrer" className="underline">https://resend.com/domains</a></li>
              <li>Adicione e verifique seu domínio</li>
              <li>Atualize a função Edge para usar seu domínio verificado</li>
            </ol>
          </>
        ) : isApiKeyError ? (
          <>
            {error}
            <p className="mt-2 text-sm">
              O administrador do sistema precisa configurar a chave RESEND_API_KEY nas funções do Supabase.
            </p>
          </>
        ) : (
          error
        )}
      </AlertDescription>
    </Alert>
  );
};

export default InviteErrorAlert;
