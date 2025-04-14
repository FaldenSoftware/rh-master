
import { Resend } from 'npm:resend@2.0.0';
import formData from 'npm:form-data@4.0.0';
import Mailgun from 'npm:mailgun.js@9.3.0';

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
      from: 'RH Mentor Mastery <noreply@rhmentormastery.com.br>',
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
    const verifiedDomain = Deno.env.get('RESEND_VERIFIED_DOMAIN');
    
    let fromEmail;
    let useTestMode = false;
    
    // Verificar se temos um domínio verificado
    if (verifiedDomain) {
      fromEmail = `RH Mentor Mastery <noreply@${verifiedDomain}>`;
      console.log(`Usando domínio verificado: ${verifiedDomain} para enviar email`);
    } else {
      // Se não temos um domínio verificado, usar o domínio padrão do Resend (modo de teste)
      fromEmail = 'RH Mentor Mastery <onboarding@resend.dev>';
      console.log('ATENÇÃO: Usando domínio padrão do Resend (modo de teste). Os emails serão enviados apenas para o proprietário da conta Resend.');
      useTestMode = true;
    }
    
    console.log(`Enviando email usando o endereço: ${fromEmail}`);
    
    const emailResponse = await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject,
      html: htmlContent
    });
    
    console.log('Resposta do Resend:', JSON.stringify(emailResponse));

    if (emailResponse?.id) {
      return {
        success: true,
        id: emailResponse.id,
        service: 'Resend',
        isTestMode: useTestMode
      };
    }
    
    console.error('Erro ao enviar e-mail com Resend:', emailResponse);
    
    // Se tiver um erro relacionado à verificação de domínio, retornar informações específicas
    if (emailResponse?.error?.message?.includes('domain is not verified')) {
      return { 
        success: false, 
        error: emailResponse.error,
        isDomainError: true,
        errorMessage: `O domínio rhmentormastery.com.br não está verificado. Por favor, adicione e verifique o domínio em https://resend.com/domains`
      };
    }
    
    return { success: false, error: emailResponse.error };
  } catch (resendError: any) {
    console.error('Erro específico ao enviar email com Resend:', resendError);
    
    // Verificar se o erro está relacionado ao domínio não verificado
    if (resendError?.message?.includes('domain is not verified')) {
      return { 
        success: false, 
        error: resendError,
        isDomainError: true,
        errorMessage: `O domínio rhmentormastery.com.br não está verificado. Por favor, adicione e verifique o domínio em https://resend.com/domains`
      };
    }
    
    return { success: false, error: resendError };
  }
};
