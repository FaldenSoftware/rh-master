
// Response formatting utilities for the email sending function
import { corsHeaders } from './types.ts';

export interface SuccessResponse {
  success: true;
  message: string;
  id?: string;
  service?: string;
  isTestMode?: boolean;
  intendedRecipient?: string;
  actualRecipient?: string;
  warningMessage?: string;
}

export const createSuccessResponse = (
  service: string,
  emailId: string,
  isTestMode = false,
  intendedRecipient?: string
): Response => {
  const responseData: SuccessResponse = {
    success: true,
    message: `E-mail enviado com sucesso via ${service}`,
    id: emailId,
    service
  };
  
  // Add test mode information if applicable
  if (isTestMode) {
    responseData.isTestMode = true;
    responseData.intendedRecipient = intendedRecipient;
    responseData.actualRecipient = "proprietário da conta Resend";
    responseData.warningMessage = "O email foi enviado em modo de teste. Acesse https://resend.com/domains para verificar o domínio rhmentormastery.com.br";
  }
  
  return new Response(
    JSON.stringify(responseData),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

export const responseWithCORS = (response: Response): Response => {
  const headers = new Headers(response.headers);
  
  // Add CORS headers to the response
  Object.entries(corsHeaders).forEach(([key, value]) => {
    headers.set(key, value);
  });
  
  // Return a new response with the CORS headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
};

export const createDomainErrorResponse = (errorMessage: string): Response => {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: 'Erro de domínio', 
      message: errorMessage,
      action: "Por favor, verifique o domínio rhmentormastery.com.br em https://resend.com/domains"
    }),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};
