
import { corsHeaders, InviteEmailData } from './types.ts';
import { sendWithGoDaddy } from './emailServices.ts';
import { buildInviteEmailHtml } from './emailBuilder.ts';
import { createErrorResponse } from './errorHandler.ts';
import { createSuccessResponse } from './responseFormatter.ts';

export const handleInviteEmailRequest = async (req: Request): Promise<Response> => {
  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ success: false, error: 'Método não permitido' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rawData = await req.json();
    console.log("Dados brutos recebidos:", JSON.stringify(rawData));
    
    const data: InviteEmailData = {
      email: rawData.email || rawData.to || '',
      clientName: rawData.clientName || rawData.client_name || '',
      mentorName: rawData.mentorName || rawData.mentor_name || 'Seu mentor',
      mentorCompany: rawData.mentorCompany || rawData.mentor_company || 'RH Mentor Mastery'
    };
    
    console.log("Dados normalizados:", JSON.stringify(data));
    
    if (!data.email) {
      const errorMsg = 'Email é obrigatório';
      console.error(errorMsg, { dados_recebidos: rawData });
      return createErrorResponse(errorMsg, rawData);
    }

    const smtpUsername = Deno.env.get('SMTP_USERNAME');
    const smtpPassword = Deno.env.get('SMTP_PASSWORD');
    
    if (!smtpUsername || !smtpPassword) {
      console.error('Credenciais SMTP não configuradas nas variáveis de ambiente');
      return createErrorResponse(
        'Configuração de e-mail ausente. Contate o administrador do sistema.',
        null
      );
    }
    
    const htmlContent = buildInviteEmailHtml(data.clientName, data.mentorName, data.mentorCompany);
    
    console.log(`Enviando e-mail para ${data.email}`);
    
    try {
      const emailResult = await sendWithGoDaddy(
        data.email, 
        `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
        htmlContent,
        smtpUsername,
        smtpPassword
      );
      
      if (emailResult.success) {
        return createSuccessResponse('GoDaddy', emailResult.id || '');
      } else {
        return createErrorResponse(
          'Falha ao enviar e-mail.',
          emailResult.error
        );
      }
    } catch (emailError) {
      console.error('Erro ao tentar enviar email:', emailError);
      return createErrorResponse(
        'Erro ao processar envio de email',
        emailError.message || 'Erro desconhecido'
      );
    }
  } catch (error) {
    console.error('Erro ao processar requisição:', error);
    return createErrorResponse(
      'Falha ao processar solicitação de envio de e-mail',
      error.message
    );
  }
};
