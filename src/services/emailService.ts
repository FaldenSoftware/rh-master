import { Resend } from 'resend';

// Inicializa o cliente Resend com a chave API do ambiente
const resend = new Resend(process.env.RESEND_API_KEY || '');

/**
 * Envia um email de convite para um cliente
 * @param to Email do destinatário
 * @param from Email do remetente (padrão configurado no Resend)
 * @param subject Assunto do email
 * @param html Corpo do email em HTML
 * @returns Objeto de resposta do envio ou erro
 */
export const sendInviteEmail = async (
  to: string,
  from: string = 'RH Mentor Mastery <onboarding@seu-dominio.com>', // Ajuste para seu domínio verificado no Resend
  subject: string = 'Convite para RH Mentor Mastery',
  html: string
) => {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Chave API do Resend não configurada. Verifique suas variáveis de ambiente.');
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error('Erro ao enviar email com Resend:', error);
      throw new Error(`Falha ao enviar email: ${error.message}`);
    }

    console.log('Email enviado com sucesso:', data);
    return data;
  } catch (err) {
    console.error('Erro no serviço de email:', err);
    throw err instanceof Error ? err : new Error('Erro desconhecido ao enviar email');
  }
};

/**
 * Gera o HTML para email de convite
 * @param inviteCode Código de convite ou link
 * @param mentorName Nome do mentor (opcional)
 * @returns HTML formatado para o email
 */
export const generateInviteEmailHTML = (
  inviteCode: string,
  mentorName: string = 'Equipe RH Mentor Mastery'
) => {
  const inviteLink = inviteCode.startsWith('http') 
    ? inviteCode 
    : `${window?.location?.origin || 'https://seu-dominio.com'}/invite/${inviteCode}`;
  
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Convite RH Mentor Mastery</title>
    </head>
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 30px; text-align: center;">
            <h1 style="color: #007BFF; margin-bottom: 20px;">Convite para RH Mentor Mastery</h1>
            <p style="color: #333333; line-height: 1.6; margin-bottom: 25px;">
              Olá! ${mentorName} convidou você para fazer parte da plataforma RH Mentor Mastery.
              Clique no botão abaixo para aceitar o convite e começar.
            </p>
            <a href="${inviteLink}" style="display: inline-block; background-color: #007BFF; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-bottom: 20px;">Aceitar Convite</a>
            <p style="color: #777777; font-size: 14px;">
              Se o botão não funcionar, copie e cole este link no seu navegador:<br>
              <a href="${inviteLink}" style="color: #007BFF; word-break: break-all;">${inviteLink}</a>
            </p>
          </td>
        </tr>
        <tr>
          <td style="background-color: #f8f8f8; text-align: center; padding: 15px; font-size: 12px; color: #777777; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
            &copy; RH Mentor Mastery. Todos os direitos reservados.
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};
