// Supabase Edge Function para enviar e-mails de convite
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
    const registerUrl = `${Deno.env.get('PUBLIC_SITE_URL') || 'https://rh-mentor-mastery.vercel.app'}/client/register?code=${data.code}`;
    
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

    // Configurar o serviço de e-mail (usando a API do Supabase)
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    // Enviar o e-mail usando o serviço de e-mail do Supabase
    const response = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify({
        to: data.email,
        subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
        html: emailBody.replace(/\n/g, '<br>'),
        text: emailBody
      })
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
