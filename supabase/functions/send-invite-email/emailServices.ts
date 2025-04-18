
import { SMTPClient } from "npm:emailjs@4.0.3";

export const sendWithGoDaddy = async (
  email: string, 
  subject: string, 
  htmlContent: string,
  smtpUsername: string,
  smtpPassword: string
) => {
  console.log('Tentando enviar email via GoDaddy SMTP...');
  console.log(`Configuração: Host=smtpout.secureserver.net, Port=465, SSL=true, Username=${smtpUsername.substring(0, 3)}...`);
  
  try {
    const client = new SMTPClient({
      user: smtpUsername,
      password: smtpPassword,
      host: "smtpout.secureserver.net",
      port: 465,
      ssl: true,
      timeout: 30000 // aumentando o timeout para 30 segundos para lidar com possíveis lentidões
    });

    console.log('Cliente SMTP criado com sucesso, tentando enviar email');
    
    const message = await client.sendAsync({
      from: "RH Mentor Mastery <contato@rhmaster.space>",
      to: email,
      subject: subject,
      text: "Por favor, use um cliente de email que suporte HTML para visualizar esta mensagem.",
      attachment: [
        { data: htmlContent, alternative: true }
      ]
    });
    
    console.log('Email enviado com sucesso via GoDaddy:', message.header["message-id"]);
    return {
      success: true,
      id: message.header["message-id"],
      service: 'GoDaddy'
    };
    
  } catch (error) {
    console.error('Erro detalhado ao enviar email via GoDaddy:', JSON.stringify({
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    }));
    
    return {
      success: false,
      error: error,
      errorCode: error.code || 'UNKNOWN',
      errorMessage: error.message || 'Erro desconhecido'
    };
  }
}

// Implementar método de fallback usando mailtrap como alternativa
export const sendWithMailtrap = async (
  email: string,
  subject: string,
  htmlContent: string
) => {
  console.log('Tentando enviar email via Mailtrap (fallback)...');
  
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

    console.log('Cliente Mailtrap criado com sucesso, tentando enviar email');
    
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
      id: message.header["message-id"],
      service: 'Mailtrap'
    };
    
  } catch (error) {
    console.error('Erro detalhado ao enviar email via Mailtrap:', JSON.stringify({
      message: error.message,
      code: error.code,
      name: error.name
    }));
    
    return {
      success: false,
      error: error,
      errorCode: error.code || 'UNKNOWN',
      errorMessage: error.message || 'Erro desconhecido'
    };
  }
}
