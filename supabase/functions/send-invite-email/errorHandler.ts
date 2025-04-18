
// Error handling utilities for the email sending function
import { corsHeaders } from './types.ts';

export interface ErrorResponse {
  success: boolean;
  error: string;
  details?: any;
  message?: string;
  action?: string;
  isDomainError?: boolean;
  isApiKeyError?: boolean;
  isSmtpError?: boolean;
}

export const createErrorResponse = (
  error: string | Error, 
  details?: any,
  isDomainError = false,
  isApiKeyError = false,
  isSmtpError = false
): Response => {
  const errorMessage = error instanceof Error ? error.message : error;
  console.error(`Error response: ${errorMessage}`, details ? { details } : "");
  
  const responseBody: ErrorResponse = { 
    success: false, 
    error: errorMessage,
  };

  // Add domain-specific error details
  if (isDomainError) {
    responseBody.isDomainError = true;
    responseBody.message = "O domínio rhmentormastery.com.br não está verificado";
    responseBody.action = "Por favor, verifique o domínio rhmentormastery.com.br em https://resend.com/domains";
  } 
  // Add API key configuration error details
  else if (isApiKeyError) {
    responseBody.isApiKeyError = true;
    responseBody.message = "Configuração de e-mail ausente. Contate o administrador do sistema";
  }
  // Add SMTP error details
  else if (isSmtpError) {
    responseBody.isSmtpError = true;
    responseBody.message = "Erro de conexão com o servidor SMTP";
  }
  
  // Include error details if provided
  if (details) {
    responseBody.details = details;
  }

  return new Response(
    JSON.stringify(responseBody),
    { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
};

export const errorResponse = (
  message: string,
  details?: any
): Response => {
  const isSmtpError = 
    message.includes('SMTP') ||
    message.includes('email') ||
    message.includes('connection') ||
    (details?.isSmtpError);

  const isApiKeyError =
    message.includes('API key') ||
    message.includes('Configuração de e-mail') ||
    message.includes('ausente');

  return createErrorResponse(
    message, 
    details, 
    false, 
    isApiKeyError,
    isSmtpError
  );
};

export const handleServiceError = (error: any): boolean => {
  const errorMessage = error?.message || 'Erro desconhecido';
  
  // Check if the error is related to API keys
  if (errorMessage.includes('API key') || 
      errorMessage.includes('Configuração de e-mail') ||
      errorMessage.includes('ausente')) {
    return true;
  }
  
  return false;
};

export const isDomainVerificationError = (error: any): boolean => {
  const errorMessage = error?.message || '';
  
  // Check if the error is related to domain verification
  if (errorMessage.includes('domain') || 
      errorMessage.includes('verify') ||
      errorMessage.includes('validation_error')) {
    return true;
  }
  
  return false;
};
