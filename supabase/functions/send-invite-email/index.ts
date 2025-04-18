
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { errorResponse } from "./errorHandler.ts";
import { responseWithCORS } from "./responseFormatter.ts";
import { buildInviteEmailHtml } from "./emailBuilder.ts";
import { sendWithGoDaddy } from "./emailServices.ts";
import { EmailRequestBody } from "./types.ts";

async function handleRequest(req: Request): Promise<Response> {
  try {
    // Obter configurações de email do ambiente
    const smtpUsername = Deno.env.get("SMTP_USERNAME");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    
    // Verificar se as configurações de email estão presentes
    if (!smtpUsername || !smtpPassword) {
      console.error("Configuração de email ausente. Verifique as variáveis de ambiente.");
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
    
    // Construir o conteúdo do email
    const subject = `Convite para participar da plataforma ${companyName}`;
    const htmlContent = buildInviteEmailHtml(clientName, mentorDisplayName, companyName);
    
    console.log(`Tentando enviar email para ${email}`);
    
    // Modo de teste - para ambiente de desenvolvimento
    const isTestMode = Deno.env.get("ENVIRONMENT") === "development";
    const actualRecipient = isTestMode ? (Deno.env.get("TEST_EMAIL_RECIPIENT") || email) : email;
    
    if (isTestMode) {
      console.log("MODO DE TESTE: Email será enviado para", actualRecipient, "em vez de", email);
    }
    
    // Enviar email através do serviço GoDaddy
    const result = await sendWithGoDaddy(
      actualRecipient,
      subject,
      htmlContent,
      smtpUsername,
      smtpPassword
    );
    
    if (!result.success) {
      console.error("Erro no serviço de email:", result.error);
      return errorResponse("Falha ao enviar email. Tente novamente mais tarde.", { details: result.error });
    }
    
    // Resposta de sucesso
    return responseWithCORS(
      new Response(
        JSON.stringify({
          success: true,
          message: `Email enviado com sucesso para ${email}`,
          isTestMode,
          actualRecipient: isTestMode ? actualRecipient : undefined,
          intendedRecipient: isTestMode ? email : undefined
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
