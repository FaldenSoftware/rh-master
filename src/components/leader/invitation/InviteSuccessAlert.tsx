
import React from "react";
import { CheckCircle2, InfoIcon } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface InviteSuccessAlertProps {
  message?: string;
  isTestMode?: boolean;
  actualRecipient?: string;
  intendedRecipient?: string;
  clientEmail: string;
  serviceName?: string;
}

const InviteSuccessAlert: React.FC<InviteSuccessAlertProps> = ({ 
  message, 
  isTestMode, 
  actualRecipient, 
  intendedRecipient,
  clientEmail,
  serviceName
}) => {
  return (
    <Alert className="bg-green-50 text-green-800 border-green-200">
      <CheckCircle2 className="h-4 w-4 mr-2" />
      <AlertTitle className="flex items-center gap-2">
        Convite enviado com sucesso!
        {serviceName && (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
            via {serviceName}
          </Badge>
        )}
      </AlertTitle>
      <AlertDescription>
        <p className="mt-2">{message || `O convite foi enviado para ${clientEmail} com sucesso.`}</p>
        
        {isTestMode && (
          <div className="mt-2 text-sm bg-amber-50 border-l-4 border-amber-300 p-3 rounded">
            <div className="flex items-center mb-1">
              <InfoIcon className="h-4 w-4 mr-1 text-amber-500" />
              <span className="font-medium text-amber-700">Modo de teste</span>
            </div>
            <p>O sistema está em modo de teste. O email foi enviado para <span className="font-medium">{actualRecipient}</span> ao invés de <span className="font-medium">{intendedRecipient || clientEmail}</span>.</p>
          </div>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default InviteSuccessAlert;
