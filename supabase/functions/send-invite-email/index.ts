
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

// @ts-ignore: Ignorando erro de importação do Deno em ambiente de desenvolvimento
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
// @ts-ignore: Ignorando erro de importação do npm em ambiente de desenvolvimento
import { Resend } from 'npm:resend@2.0.0';
// @ts-ignore: Ignorando erro de importação do npm em ambiente de desenvolvimento
import sgMail from 'npm:@sendgrid/mail@7.7.0';

// Interface para os dados do corpo da requisição
interface InviteEmailData {
  email: string;
  code: string;
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
      console.error(`Método não permitido: ${req.method}`);
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter dados do corpo da requisição
    let data: InviteEmailData;
    try {
      data = await req.json() as InviteEmailData;
      console.log("Dados recebidos:", JSON.stringify(data));
    } catch (parseError) {
      console.error("Erro ao analisar JSON da requisição:", parseError);
      return new Response(
        JSON.stringify({ error: 'JSON inválido na requisição' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validar dados obrigatórios
    if (!data.email || !data.code) {
      const errorMsg = 'Email e código são obrigatórios';
      console.error(errorMsg, { email: data.email, code: data.code });
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se temos pelo menos um serviço de email configurado
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY');
    
    console.log("Verificando chaves de API disponíveis...");
    if (resendApiKey) {
      console.log("✓ Resend API Key encontrada, comprimento:", resendApiKey.length);
    } else {
      console.log("✗ Resend API Key não encontrada");
    }
    
    if (sendgridApiKey) {
      console.log("✓ SendGrid API Key encontrada, comprimento:", sendgridApiKey.length);
    } else {
      console.log("✗ SendGrid API Key não encontrada");
    }
    
    if (!resendApiKey && !sendgridApiKey) {
      console.error('Nenhuma API key de serviço de email está configurada nas variáveis de ambiente');
      return new Response(
        JSON.stringify({ 
          error: 'Configuração de e-mail ausente',
          details: 'Nenhum serviço de email configurado. Contate o administrador do sistema.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Montar o corpo do e-mail com formato HTML
    const clientNameText = data.clientName ? `Olá ${data.clientName},` : 'Olá,';
    // @ts-ignore: Ignorando erro de referência ao Deno em ambiente de desenvolvimento
    const registerUrl = `${'https://rh-mentor-mastery.vercel.app'}/client/register?code=${data.code}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #4F46E5;">${clientNameText}</h2>
        
        <p>Você foi convidado(a) por <strong>${data.mentorName}</strong> da empresa <strong>${data.mentorCompany}</strong> para participar da plataforma RH Mentor Mastery.</p>
        
        <p>Para se registrar, utilize o código abaixo ou clique no link:</p>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center;">
          <p style="font-size: 18px; font-weight: bold; font-family: monospace;">Código de convite: ${data.code}</p>
        </div>
        
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
    
    console.log(`Enviando e-mail para ${data.email} com código ${data.code}`);
    
    // Tentar enviar o email com cada serviço disponível
    let emailSent = false;
    let emailId = '';
    let serviceUsed = '';
    let errorDetails = [];
    
    // Tentar enviar com Resend primeiro (se disponível)
    if (resendApiKey) {
      try {
        console.log('Tentando enviar email via Resend...');
        const resend = new Resend(resendApiKey);
        
        const emailResponse = await resend.emails.send({
          from: 'RH Mentor Mastery <onboarding@resend.dev>',
          to: [data.email],
          subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
          html: htmlContent
        });
        
        console.log('Resposta do Resend:', JSON.stringify(emailResponse));

        // Verificar se o e-mail foi enviado com sucesso
        if (emailResponse?.id) {
          emailSent = true;
          emailId = emailResponse.id;
          serviceUsed = 'Resend';
          console.log('✓ Email enviado com sucesso via Resend');
        } else {
          const error = "Erro desconhecido do Resend (sem ID retornado)";
          console.error(error);
          errorDetails.push({ service: 'Resend', error });
        }
      } catch (resendError) {
        console.error('Erro específico ao enviar email com Resend:', resendError);
        errorDetails.push({ service: 'Resend', error: resendError.message || "Erro desconhecido" });
      }
    }
    
    // Se Resend falhou ou não está disponível, tentar SendGrid
    if (!emailSent && sendgridApiKey) {
      try {
        console.log('Tentando enviar email via SendGrid...');
        sgMail.setApiKey(sendgridApiKey);
        
        const msg = {
          to: data.email,
          from: 'onboarding@rhmentormastery.com.br', // Usar um domínio verificado no SendGrid
          subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
          html: htmlContent,
        };
        
        const sendgridResponse = await sgMail.send(msg);
        console.log('Resposta do SendGrid:', JSON.stringify(sendgridResponse));
        
        if (sendgridResponse && sendgridResponse[0]?.statusCode === 202) {
          emailSent = true;
          emailId = 'sg_' + Date.now(); // SendGrid não retorna ID, então criamos um
          serviceUsed = 'SendGrid';
          console.log('✓ Email enviado com sucesso via SendGrid');
        } else {
          const error = "Resposta inesperada do SendGrid";
          console.error(error, sendgridResponse);
          errorDetails.push({ service: 'SendGrid', error, response: sendgridResponse });
        }
      } catch (sendgridError) {
        console.error('Erro específico ao enviar email com SendGrid:', sendgridError);
        errorDetails.push({ service: 'SendGrid', error: sendgridError.message || "Erro desconhecido" });
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
      console.error('Todos os serviços de email falharam:', JSON.stringify(errorDetails));
      
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Falha ao enviar e-mail. Verifique a configuração dos serviços de email.',
          details: errorDetails
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    // Tratar erros gerais
    console.error('Erro não tratado ao processar solicitação:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Erro interno do servidor',
        message: error.message || 'Falha ao processar solicitação de envio de e-mail',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
