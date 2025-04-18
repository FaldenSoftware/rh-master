
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { SMTPClient } from "npm:emailjs@4.0.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Método para enviar email via Mailtrap
const sendMailtrap = async (
  email: string,
  subject: string,
  htmlContent: string
) => {
  console.log('Enviando email via Mailtrap para:', email);
  
  try {
    // Credenciais sandbox mailtrap (seguras para teste)
    const client = new SMTPClient({
      user: "d2f32c24c33834",
      password: "51d5f2e0a25dd5",
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      tls: true,
      timeout: 20000
    });
    
    const message = await client.sendAsync({
      from: "RH Mentor Mastery <noreply@rhmentormastery.com>",
      to: email,
      subject: subject,
      text: "Por favor, use um cliente de email que suporte HTML para visualizar esta mensagem.",
      attachment: [
        { data: htmlContent, alternative: true }
      ]
    });
    
    console.log('Email enviado com sucesso via Mailtrap:', message.header["message-id"]);
    return {
      success: true,
      id: message.header["message-id"]
    };
    
  } catch (error) {
    console.error('Erro detalhado ao enviar email via Mailtrap:', error);
    
    return {
      success: false,
      error: error,
      errorMessage: error.message || 'Erro desconhecido'
    };
  }
};

async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  
  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ success: false, error: "Método não permitido" }),
        { 
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Processar request body
    const { email, clientName, mentorName, mentorCompany, subject, htmlContent } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email do destinatário é necessário" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // Usar conteúdo HTML fornecido ou gerar um padrão
    const emailSubject = subject || `Convite para participar da plataforma ${mentorCompany || "RH Mentor Mastery"}`;
    let emailContent = htmlContent;
    
    if (!emailContent) {
      const clientDisplayName = clientName || "Cliente";
      const mentorDisplayName = mentorName || "Mentor";
      const companyName = mentorCompany || "RH Mentor Mastery";
      
      // Email HTML simples
      emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Olá ${clientDisplayName},</h2>
          <p>Você foi convidado por ${mentorDisplayName} para se juntar à plataforma ${companyName}.</p>
          <p>Acesse nosso site para completar seu registro.</p>
          <p>Atenciosamente,<br>${companyName}</p>
        </div>
      `;
    }
    
    // Enviar email
    const result = await sendMailtrap(email, emailSubject, emailContent);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Falha ao enviar email",
          details: result.errorMessage
        }),
        { 
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `Email enviado com sucesso para ${email} via Mailtrap`,
        id: result.id,
        service: "Mailtrap"
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("Erro inesperado:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Erro interno do servidor",
        details: error.message
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}

serve(handleRequest);
