
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { errorResponse } from "./errorHandler.ts";
import { responseWithCORS } from "./responseFormatter.ts";
import { buildInviteEmailHtml } from "./emailBuilder.ts";
import { sendWithGoDaddy, sendWithMailtrap } from "./emailServices.ts";
import { EmailRequestBody } from "./types.ts";

async function handleRequest(req: Request): Promise<Response> {
  try {
    // Obter configurações de email do ambiente
    const smtpUsername = Deno.env.get("SMTP_USERNAME");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    
    // Verificar se as configurações de email estão presentes
    if (!smtpUsername || !smtpPassword) {
      console.error("Configuração de email ausente. Verificando variáveis de ambiente:", {
        usernameExists: Boolean(smtpUsername),
        passwordExists: Boolean(smtpPassword)
      });
      return errorResponse("Configuração de email ausente. Verifique as variáveis de ambiente.");
    }
    
    if (req.method === "OPTIONS") {
      return responseWithCORS(new Response(null, { status: 204 }));
    }

    if (req.method !== "POST") {
      return errorResponse("Método não permitido. Use POST.");
    }

    // Parse request body
    const requestData = await req.json() as EmailRequestBody;
    const { email, clientName, mentorName, mentorCompany, registerUrl } = requestData;
    
    // Validar dados do request
    if (!email) {
      return errorResponse("Email do destinatário é necessário.");
    }
    
    const companyName = mentorCompany || "RH Mentor Mastery";
    const mentorDisplayName = mentorName || "Mentor";
    const clientDisplayName = clientName || "Cliente";
    
    // Construir o conteúdo do email
    const subject = `Convite para participar da plataforma ${companyName}`;
    const htmlContent = buildInviteEmailHtml(clientDisplayName, mentorDisplayName, companyName);
    
    console.log(`Tentando enviar email para ${email}`);
    
    // Modo de teste - para ambiente de desenvolvimento
    const isTestMode = Deno.env.get("ENVIRONMENT") === "development";
    const actualRecipient = isTestMode ? (Deno.env.get("TEST_EMAIL_RECIPIENT") || email) : email;
    
    if (isTestMode) {
      console.log("MODO DE TESTE: Email será enviado para", actualRecipient, "em vez de", email);
    }
    
    // Envio principal via GoDaddy para todos os emails
    let result = await sendWithGoDaddy(
      actualRecipient,
      subject,
      htmlContent,
      smtpUsername,
      smtpPassword
    );
    
    // Não usar fallback automático (conforme pedido pelo cliente)
    // Retornar resultado direto do GoDaddy, seja sucesso ou erro
    
    if (!result.success) {
      const errorDetails = {
        mainError: result.errorMessage || "Erro desconhecido",
        errorCode: result.errorCode || "UNKNOWN",
        timestamp: new Date().toISOString(),
        recipient: actualRecipient,
        isSmtpError: true,
        provider: "GoDaddy"
      };
      
      console.error("Erro no serviço de email (GoDaddy):", errorDetails);
      return errorResponse("Falha ao enviar email via GoDaddy. Verificar configuração SMTP.", { 
        details: errorDetails,
        isSmtpError: true
      });
    }
    
    // Resposta de sucesso
    return responseWithCORS(
      new Response(
        JSON.stringify({
          success: true,
          message: `Email enviado com sucesso para ${email} via ${result.service}`,
          isTestMode,
          actualRecipient: isTestMode ? actualRecipient : undefined,
          intendedRecipient: isTestMode ? email : undefined,
          service: result.service
        }),
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Erro inesperado:", error);
    return errorResponse("Erro interno do servidor", { error });
  }
}

serve(handleRequest);
