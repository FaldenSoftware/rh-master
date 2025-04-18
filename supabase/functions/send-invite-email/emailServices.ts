
import { SMTPClient } from "npm:emailjs@4.0.3";

export const sendWithGoDaddy = async (
  email: string, 
  subject: string, 
  htmlContent: string,
  smtpUsername: string,
  smtpPassword: string
) => {
  console.log('Tentando enviar email via GoDaddy SMTP...');
  
  const client = new SMTPClient({
    user: smtpUsername,
    password: smtpPassword,
    host: "smtpout.secureserver.net",
    port: 465,
    ssl: true
  });

  try {
    const message = await client.sendAsync({
      from: "RH Mentor Mastery <contato@rhmaster.space>",
      to: email,
      subject: subject,
      text: "Por favor, use um cliente de email que suporte HTML para visualizar esta mensagem.",
      attachment: [
        { data: htmlContent, alternative: true }
      ]
    });
    
    console.log('Email enviado com sucesso via GoDaddy');
    return {
      success: true,
      id: message.header["message-id"],
      service: 'GoDaddy'
    };
    
  } catch (error) {
    console.error('Erro ao enviar email via GoDaddy:', error);
    return {
      success: false,
      error: error
    };
  }
}
