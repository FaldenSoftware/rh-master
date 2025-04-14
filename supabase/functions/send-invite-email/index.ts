
// Supabase Edge Function para enviar e-mails de convite
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders, InviteEmailData } from './types.ts';
import { sendWithMailgun, sendWithResend } from './emailServices.ts';
import { buildInviteEmailHtml } from './emailBuilder.ts';

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
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
    
    // Log detalhado das chaves (apenas informar se estão presentes por segurança)
    if (mailgunApiKey) {
      console.log("Mailgun API Key encontrada, primeiros caracteres:", 
        mailgunApiKey.substring(0, 5) + "... (comprimento total: " + mailgunApiKey.length + ")");
    } else {
      console.error("ERRO: Chave de API do Mailgun não encontrada nas variáveis de ambiente!");
    }
    
    if (resendApiKey) {
      console.log("Resend API Key encontrada, primeiros caracteres:", 
        resendApiKey.substring(0, 5) + "... (comprimento total: " + resendApiKey.length + ")");
    } else {
      console.error("ERRO: Chave de API do Resend não encontrada nas variáveis de ambiente!");
    }
    
    if (!mailgunApiKey && !resendApiKey) {
      console.error('Nenhuma API key de serviço de email está configurada nas variáveis de ambiente');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Configuração de e-mail ausente. Contate o administrador do sistema para configurar as chaves da API Mailgun ou Resend.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Montar o corpo do e-mail com formato HTML
    const htmlContent = buildInviteEmailHtml(data.clientName, data.mentorName, data.mentorCompany);
    
    // Registrar os dados que serão enviados
    console.log(`Enviando e-mail para ${data.email}`);
    
    try {
      let emailSent = false;
      let emailId = '';
      let serviceUsed = '';
      
      // Tentativa 1: Mailgun (se disponível)
      if (!emailSent && mailgunApiKey) {
        const mailgunResult = await sendWithMailgun(
          data.email, 
          `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
          htmlContent,
          mailgunApiKey
        );
        
        if (mailgunResult.success) {
          emailSent = true;
          emailId = mailgunResult.id || '';
          serviceUsed = mailgunResult.service || 'Mailgun';
          console.log('Email enviado com sucesso via Mailgun');
        }
      }
      
      // Tentativa 2: Resend (se Mailgun falhar ou não estiver disponível)
      if (!emailSent && resendApiKey) {
        const resendResult = await sendWithResend(
          data.email, 
          `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
          htmlContent,
          resendApiKey
        );
        
        if (resendResult.success) {
          emailSent = true;
          emailId = resendResult.id || '';
          serviceUsed = resendResult.service || 'Resend';
          console.log('Email enviado com sucesso via Resend');
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

