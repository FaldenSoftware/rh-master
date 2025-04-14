
// Request handler for email invitation service
import { corsHeaders, InviteEmailData } from './types.ts';
import { sendWithMailgun, sendWithResend } from './emailServices.ts';
import { buildInviteEmailHtml } from './emailBuilder.ts';
import { createErrorResponse, isDomainVerificationError } from './errorHandler.ts';
import { createSuccessResponse, createDomainErrorResponse } from './responseFormatter.ts';

export const handleInviteEmailRequest = async (req: Request): Promise<Response> => {
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
      return createErrorResponse(errorMsg, rawData);
    }

    // Verificar se temos pelo menos um serviço de email configurado
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const mailgunApiKey = Deno.env.get('MAILGUN_API_KEY');
    const verifiedDomain = Deno.env.get('RESEND_VERIFIED_DOMAIN');
    
    // Log detalhado das chaves e domínios configurados
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
    
    if (verifiedDomain) {
      console.log("Domínio verificado para Resend encontrado:", verifiedDomain);
    } else {
      console.log("ATENÇÃO: Nenhum domínio verificado configurado para Resend. Será necessário verificar o domínio rhmentormastery.com.br em https://resend.com/domains");
    }
    
    if (!mailgunApiKey && !resendApiKey) {
      console.error('Nenhuma API key de serviço de email está configurada nas variáveis de ambiente');
      return createErrorResponse(
        'Configuração de e-mail ausente. Contate o administrador do sistema para configurar as chaves da API Mailgun ou Resend.',
        null,
        false,
        true
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
      let isTestMode = false;
      let domainError = false;
      let domainErrorMessage = '';
      
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
          isTestMode = resendResult.isTestMode || false;
          console.log('Email enviado com sucesso via Resend');
        } else if (resendResult.isDomainError) {
          domainError = true;
          domainErrorMessage = resendResult.errorMessage || 'Domínio não verificado no Resend';
          console.error('Erro de domínio no Resend:', domainErrorMessage);
        }
      }
      
      // Verificar se algum serviço conseguiu enviar o email
      if (emailSent) {
        return createSuccessResponse(serviceUsed, emailId, isTestMode, data.email);
      } else if (domainError) {
        return createDomainErrorResponse(domainErrorMessage);
      } else {
        return createErrorResponse(
          'Falha ao enviar e-mail. Todos os serviços de email falharam.',
          'Verifique se as chaves de API estão configuradas corretamente e se o domínio rhmentormastery.com.br está verificado em https://resend.com/domains'
        );
      }
    } catch (emailError) {
      console.error('Erro geral ao tentar enviar email:', emailError);
      
      // Determine if this is a domain or API key error
      const isApiKeyError = emailError.message?.includes('API key');
      const isDomainError = isDomainVerificationError(emailError);
      
      return createErrorResponse(
        'Erro ao processar envio de email',
        emailError.message || 'Erro desconhecido',
        isDomainError,
        isApiKeyError
      );
    }
  } catch (error) {
    // Tratar erros gerais
    console.error('Erro ao processar requisição:', error);
    return createErrorResponse(
      'Falha ao processar solicitação de envio de e-mail',
      error.message
    );
  }
};
