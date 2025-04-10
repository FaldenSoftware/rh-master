// Supabase Edge Function para enviar e-mails de convite
// @ts-ignore: Ignorando erro de importação do Deno em ambiente de desenvolvimento
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// Interface para os dados do corpo da requisição
interface InviteEmailData {
  email: string;
  code: string;
  clientName?: string;
  mentorName: string;
  mentorCompany: string;
}

// Função principal que será executada pelo Supabase Edge Functions
serve(async (req) => {
  try {
    // Verificar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { status: 405, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Obter dados do corpo da requisição
    const data = await req.json() as InviteEmailData;
    
    // Validar dados obrigatórios
    if (!data.email || !data.code) {
      return new Response(
        JSON.stringify({ error: 'Email e código são obrigatórios' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Montar o corpo do e-mail
    const clientNameText = data.clientName ? `Olá ${data.clientName},` : 'Olá,';
    // @ts-ignore: Ignorando erro de referência ao Deno em ambiente de desenvolvimento
    const registerUrl = `${'https://rh-mentor-mastery.vercel.app'}/client/register?code=${data.code}`;
    
    const emailBody = `
      ${clientNameText}
      
      Você foi convidado(a) por ${data.mentorName} da empresa ${data.mentorCompany} para participar da plataforma RH Mentor Mastery.
      
      Para se registrar, utilize o código abaixo ou clique no link:
      
      Código de convite: ${data.code}
      
      Link para registro: ${registerUrl}
      
      Este convite é válido por 7 dias.
      
      Atenciosamente,
      Equipe RH Mentor Mastery
    `;

    // Configurar o serviço de e-mail usando SendGrid
    console.log(`Enviando e-mail para ${data.email} com código ${data.code}`);
    
    // Obter a chave de API do SendGrid das variáveis de ambiente
    const apiKey = Deno.env.get('SENDGRID_API_KEY');
    
    if (!apiKey) {
      console.error('SENDGRID_API_KEY não está configurada nas variáveis de ambiente');
      throw new Error('Configuração de e-mail ausente. Contate o administrador do sistema.');
    }
    
    // Preparar o conteúdo do e-mail em formato HTML
    const htmlContent = emailBody.replace(/\n/g, '<br>');
    
    // Fazer a requisição para a API do SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: data.email }] }],
        from: { email: 'noreply@rhmentormastery.com', name: 'RH Mentor Mastery' },
        subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
        content: [{ type: 'text/html', value: htmlContent }]
      })
    });
    
    // Registrar informações sobre a tentativa de envio
    console.log({
      to: data.email,
      subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
      status: response.status,
      statusText: response.statusText
    });

    // Verificar resposta
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Falha ao enviar e-mail: ${JSON.stringify(errorData)}`);
    }

    // Retornar sucesso
    return new Response(
      JSON.stringify({ success: true, message: 'E-mail enviado com sucesso' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Tratar erros
    console.error('Erro ao enviar e-mail:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Falha ao processar solicitação de envio de e-mail',
        details: error.message 
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
