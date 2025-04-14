
import { Resend } from 'npm:resend@2.0.0';
import formData from 'npm:form-data@4.0.0';
import Mailgun from 'npm:mailgun.js@9.5.0';

export const sendWithMailgun = async (
  email: string, 
  subject: string, 
  htmlContent: string,
  mailgunApiKey: string
) => {
  console.log('Tentando enviar email via Mailgun...');
  const mailgunClient = new Mailgun(formData);
  const mg = mailgunClient.client({
    username: 'api',
    key: mailgunApiKey,
  });
  
  const mailgunDomain = Deno.env.get('MAILGUN_DOMAIN') || 'sandbox.mailgun.org';
  
  try {
    const mailgunResponse = await mg.messages.create(mailgunDomain, {
      from: 'RH Mentor Mastery <noreply@mailgun.org>',
      to: [email],
      subject,
      html: htmlContent
    });
    
    console.log('Resposta do Mailgun:', JSON.stringify(mailgunResponse));
    
    if (mailgunResponse && mailgunResponse.id) {
      return {
        success: true,
        id: mailgunResponse.id,
        service: 'Mailgun'
      };
    }
    
    console.error('Erro ao enviar e-mail com Mailgun:', mailgunResponse);
    return { success: false };
  } catch (mailgunError) {
    console.error('Erro específico ao enviar email com Mailgun:', mailgunError);
    return { success: false, error: mailgunError };
  }
};

export const sendWithResend = async (
  email: string, 
  subject: string, 
  htmlContent: string,
  resendApiKey: string
) => {
  console.log('Tentando enviar email via Resend...');
  
  try {
    const resend = new Resend(resendApiKey);
    const emailResponse = await resend.emails.send({
      from: 'RH Mentor Mastery <onboarding@resend.dev>',
      to: [email],
      subject,
      html: htmlContent
    });
    
    console.log('Resposta do Resend:', JSON.stringify(emailResponse));

    if (emailResponse?.id) {
      return {
        success: true,
        id: emailResponse.id,
        service: 'Resend'
      };
    }
    
    console.error('Erro ao enviar e-mail com Resend:', emailResponse);
    return { success: false };
  } catch (resendError) {
    console.error('Erro específico ao enviar email com Resend:', resendError);
    return { success: false, error: resendError };
  }
};

