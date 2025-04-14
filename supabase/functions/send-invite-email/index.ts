
// Supabase Edge Function para enviar e-mails de convite
// Declarações de tipos para o ambiente Deno
declare global {
  interface DenoNamespace {
    env: {
      get(key: string): string | undefined;
    };
  }
  const Deno: DenoNamespace;
}

// Importando módulos necessários
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';
import sgMail from 'npm:@sendgrid/mail@7.7.0';
import formData from 'npm:form-data@4.0.0';
import Mailgun from 'npm:mailgun.js@9.5.0';

// Interface para os dados do corpo da requisição
interface InviteEmailData {
  email: string;
  clientName?: string;
  mentorName: string;
  mentorCompany: string;
}

// Configuração de cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Função principal que será executada pelo Supabase Edge Functions
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Método não permitido' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter dados do corpo da requisição
    const rawData = await req.json();
    console.log("Dados brutos recebidos:", JSON.stringify(rawData));
    
    // Normalizar os dados para garantir compatibilidade com diferentes formatos
    const data: InviteEmailData = {
      email: rawData.email || rawData.to || '',
      clientName: rawData.clientName || rawData.client_name || '',
      mentorName: rawData.mentorName || rawData.mentor_name || 'Seu mentor',
      mentorCompany: rawData.mentorCompany || rawData.mentor_company || 'RH Mentor Mastery'
    };
    
    // Log dos dados normalizados para debugging
    console.log("Dados normalizados:", JSON.stringify(data));
    
    // Validar dados obrigatórios
    if (!data.email) {
      const errorMsg = 'Email é obrigatório';
      console.error(errorMsg, { dados_recebidos: rawData });
      return new Response(
        JSON.stringify({ success: false, error: errorMsg }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se temos pelo menos um serviço de email configurado
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
    
    // Log detalhado das chaves (apenas informar se estão presentes por segurança)
    if (resendApiKey) {
      console.log("Resend API Key encontrada, primeiros caracteres:", 
        resendApiKey.substring(0, 5) + "... (comprimento total: " + resendApiKey.length + ")");
    } else {
      console.error("ERRO: Chave de API do Resend não encontrada nas variáveis de ambiente!");
    }
    
    if (sendgridApiKey) {
      console.log("SendGrid API Key encontrada, primeiros caracteres:", 
        sendgridApiKey.substring(0, 5) + "... (comprimento total: " + sendgridApiKey.length + ")");
    } else {
      console.error("ERRO: Chave de API do SendGrid não encontrada nas variáveis de ambiente!");
    }
    
    if (mailgunApiKey) {
      console.log("Mailgun API Key encontrada, primeiros caracteres:", 
        mailgunApiKey.substring(0, 5) + "... (comprimento total: " + mailgunApiKey.length + ")");
    } else {
      console.error("ERRO: Chave de API do Mailgun não encontrada nas variáveis de ambiente!");
    }
    
    if (!resendApiKey && !sendgridApiKey && !mailgunApiKey) {
      console.error('Nenhuma API key de serviço de email está configurada nas variáveis de ambiente');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Configuração de e-mail ausente. Contate o administrador do sistema para configurar as chaves da API Resend, SendGrid ou Mailgun.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Montar o corpo do e-mail com formato HTML
    const clientNameText = data.clientName ? `Olá ${data.clientName},` : 'Olá,';
    const registerUrl = `https://rh-mentor-mastery.vercel.app/client/register`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #4F46E5;">${clientNameText}</h2>
        
        <p>Você foi convidado(a) por <strong>${data.mentorName}</strong> da empresa <strong>${data.mentorCompany}</strong> para participar da plataforma RH Mentor Mastery.</p>
        
        <p>Para se registrar, clique no link abaixo:</p>
        
        <p style="text-align: center;">
          <a href="${registerUrl}" style="background-color: #4F46E5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Registrar-se Agora</a>
        </p>
        
        <p><em>Este convite é válido por 7 dias.</em></p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        
        <p style="font-size: 12px; color: #777;">
          Atenciosamente,<br>
          Equipe RH Mentor Mastery
        </p>
      </div>
    `;
    
    // Registrar os dados que serão enviados
    console.log(`Enviando e-mail para ${data.email}`);
    
    try {
      let emailSent = false;
      let emailId = '';
      let serviceUsed = '';
      
      // Tentativa 1: Mailgun (prioridade já que foi adicionado mais recentemente)
      if (!emailSent && mailgunApiKey) {
        try {
          console.log('Tentando enviar email via Mailgun...');
          const mailgunClient = new Mailgun(formData);
          const mg = mailgunClient.client({
            username: 'api',
            key: mailgunApiKey,
          });
          
          // Você deve substituir 'sandbox.mailgun.org' pelo seu domínio verificado
          // Note que domínios sandbox só podem enviar para e-mails autorizados
          const mailgunDomain = 'sandbox.mailgun.org'; // Substitua pelo seu domínio verificado
          const mailgunResponse = await mg.messages.create(mailgunDomain, {
            from: 'RH Mentor Mastery <noreply@mailgun.org>',
            to: [data.email],
            subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
            html: htmlContent
          });
          
          console.log('Resposta do Mailgun:', JSON.stringify(mailgunResponse));
          
          if (mailgunResponse && mailgunResponse.id) {
            emailSent = true;
            emailId = mailgunResponse.id;
            serviceUsed = 'Mailgun';
            console.log('Email enviado com sucesso via Mailgun');
          } else {
            console.error('Erro ao enviar e-mail com Mailgun:', mailgunResponse);
          }
        } catch (mailgunError) {
          console.error('Erro específico ao enviar email com Mailgun:', mailgunError);
        }
      }
      
      // Tentativa 2: Resend (se Mailgun falhou)
      if (!emailSent && resendApiKey) {
        try {
          console.log('Tentando enviar email via Resend...');
          const resend = new Resend(resendApiKey);
          const emailResponse = await resend.emails.send({
            from: 'RH Mentor Mastery <onboarding@resend.dev>',
            to: [data.email],
            subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
            html: htmlContent
          });
          
          // Registrar resposta do Resend
          console.log('Resposta do Resend:', JSON.stringify(emailResponse));

          // Verificar se o e-mail foi enviado com sucesso
          if (emailResponse?.id) {
            emailSent = true;
            emailId = emailResponse.id;
            serviceUsed = 'Resend';
            console.log('Email enviado com sucesso via Resend');
          } else {
            console.error('Erro ao enviar e-mail com Resend:', emailResponse);
          }
        } catch (resendError) {
          console.error('Erro específico ao enviar email com Resend:', resendError);
        }
      }
      
      // Tentativa 3: SendGrid (se os anteriores falharam)
      if (!emailSent && sendgridApiKey) {
        try {
          console.log('Tentando enviar email via SendGrid...');
          sgMail.setApiKey(sendgridApiKey);
          const msg = {
            to: data.email,
            from: 'noreply@seu-dominio-verificado.com', // Substitua pelo seu domínio verificado no SendGrid
            subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
            html: htmlContent,
          };
          
          const sendgridResponse = await sgMail.send(msg);
          console.log('Resposta do SendGrid:', JSON.stringify(sendgridResponse));
          
          if (sendgridResponse && sendgridResponse[0]?.statusCode === 202) {
            emailSent = true;
            emailId = 'sg_' + Date.now(); // SendGrid não retorna ID, então criamos um
            serviceUsed = 'SendGrid';
            console.log('Email enviado com sucesso via SendGrid');
          } else {
            console.error('Erro ao enviar e-mail com SendGrid:', sendgridResponse);
          }
        } catch (sendgridError) {
          console.error('Erro específico ao enviar email com SendGrid:', sendgridError);
        }
      }
      
      // Verificar se algum serviço conseguiu enviar o email
      if (emailSent) {
        // Retornar sucesso
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `E-mail enviado com sucesso via ${serviceUsed}`,
            id: emailId,
            service: serviceUsed
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        // Se nenhum serviço conseguiu enviar, retornar erro detalhado
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Falha ao enviar e-mail. Todos os serviços de email falharam. Verifique se as chaves de API estão configuradas corretamente e se os domínios estão verificados.'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (emailError) {
      console.error('Erro geral ao tentar enviar email:', emailError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erro ao processar envio de email',
          details: emailError.message || 'Erro desconhecido'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    // Tratar erros
    console.error('Erro ao enviar e-mail:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Falha ao processar solicitação de envio de e-mail',
        details: error.message 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
