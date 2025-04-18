
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { EmailResult } from "./types.ts";

export async function sendWithGoDaddy(
  to: string,
  subject: string,
  htmlContent: string,
  smtpUsername: string,
  smtpPassword: string
): Promise<EmailResult> {
  try {
    const client = new SmtpClient();
    
    await client.connect({
      hostname: "smtpout.secureserver.net", // GoDaddy SMTP server
      port: 465,
      username: smtpUsername,
      password: smtpPassword,
      tls: true,
    });
    
    const result = await client.send({
      from: smtpUsername,
      to: to,
      subject: subject,
      content: htmlContent,
      html: htmlContent,
    });
    
    await client.close();
    
    return {
      success: true,
      service: "GoDaddy SMTP",
    };
  } catch (error) {
    console.error("GoDaddy SMTP Error:", error);
    
    let errorCode = "UNKNOWN";
    let errorMessage = error.message || "Unknown error";
    
    // Extract more useful error information
    if (error.message?.includes("authentication")) {
      errorCode = "AUTH_FAILED";
      errorMessage = "Falha na autenticação SMTP. Verifique suas credenciais.";
    } else if (error.message?.includes("connect")) {
      errorCode = "CONNECTION_FAILED";
      errorMessage = "Não foi possível conectar ao servidor SMTP.";
    }
    
    return {
      success: false,
      service: "GoDaddy SMTP",
      errorCode,
      errorMessage,
    };
  }
}

export async function sendWithMailtrap(
  to: string,
  subject: string,
  htmlContent: string,
  mailtrapUsername: string,
  mailtrapPassword: string
): Promise<EmailResult> {
  try {
    const client = new SmtpClient();
    
    await client.connect({
      hostname: "smtp.mailtrap.io",
      port: 2525,
      username: mailtrapUsername,
      password: mailtrapPassword,
    });
    
    const result = await client.send({
      from: "noreply@rhmentormastery.com",
      to: to,
      subject: subject,
      content: htmlContent,
      html: htmlContent,
    });
    
    await client.close();
    
    return {
      success: true,
      service: "Mailtrap",
    };
  } catch (error) {
    console.error("Mailtrap Error:", error);
    
    return {
      success: false,
      service: "Mailtrap",
      errorCode: "MAILTRAP_ERROR",
      errorMessage: error.message || "Erro ao enviar email via Mailtrap",
    };
  }
}
