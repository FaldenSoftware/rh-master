
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
      timeout: 45000 // aumentando o timeout para 45 segundos para lidar com possíveis lentidões
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
    
    // Incluir mais detalhes sobre possíveis causas
    let detailedMessage = error.message || 'Erro desconhecido';
    
    if (error.code === 'EAUTH') {
      detailedMessage = 'Erro de autenticação SMTP. Verifique as credenciais do usuário e senha.';
    } else if (error.code === 'ESOCKET') {
      detailedMessage = 'Erro de conexão com o servidor SMTP. Verifique configurações de porta/SSL.';
    } else if (error.code === 'ETIMEDOUT') {
      detailedMessage = 'Tempo de conexão esgotado ao conectar ao servidor SMTP.';
    }
    
    return {
      success: false,
      error: error,
      errorCode: error.code || 'UNKNOWN',
      errorMessage: detailedMessage
    };
  }
}

// Método Mailtrap disponível como alternativa manual (não usado automaticamente)
export const sendWithMailtrap = async (
  email: string,
  subject: string,
  htmlContent: string
) => {
  console.log('Tentando enviar email via Mailtrap (método alternativo)...');
  
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

// Adiciona nova função para envio manual via Mailtrap
export const manualSendWithMailtrap = async (
  req: Request
): Promise<Response> => {
  try {
    const { email, subject, htmlContent } = await req.json();
    
    if (!email || !subject || !htmlContent) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Dados incompletos para envio de email"
        }),
        { status: 400 }
      );
    }
    
    const result = await sendWithMailtrap(email, subject, htmlContent);
    
    return new Response(
      JSON.stringify({
        success: result.success,
        id: result.id,
        service: 'Mailtrap',
        error: result.success ? undefined : result.errorMessage
      }),
      { 
        status: result.success ? 200 : 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Erro interno ao processar envio via Mailtrap"
      }),
      { status: 500 }
    );
  }
};
