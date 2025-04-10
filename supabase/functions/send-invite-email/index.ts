
// Supabase Edge Function para enviar e-mails de convite
// @ts-ignore: Ignorando erro de importação do Deno em ambiente de desenvolvimento
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// CORS headers para permitir chamadas do frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  // Lidar com requisições OPTIONS (CORS preflight)
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  try {
    // Verificar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter dados do corpo da requisição
    const data = await req.json() as InviteEmailData;
    
    console.log("Recebida solicitação para enviar e-mail de convite:", {
      email: data.email,
      code: data.code,
      clientName: data.clientName,
      mentorName: data.mentorName
    });
    
    // Validar dados obrigatórios
    if (!data.email || !data.code) {
      console.error("Dados inválidos: Email ou código ausentes");
      return new Response(
        JSON.stringify({ error: 'Email e código são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Montar o corpo do e-mail
    const clientNameText = data.clientName ? `Olá ${data.clientName},` : 'Olá,';
    // @ts-ignore: Ignorando erro de referência ao Deno em ambiente de desenvolvimento
    const registerUrl = `${'https://rh-mentor-mastery.vercel.app'}/client/register?code=${data.code}&email=${encodeURIComponent(data.email)}`;
    
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

    console.log("Corpo do e-mail preparado:", emailBody);

    // Em um ambiente real, você usaria um serviço real como SendGrid, AWS SES, etc.
    // Por enquanto, vamos registrar que tentamos enviar o email
    
    console.log(`Simulando envio de e-mail para ${data.email} com código ${data.code}`);
    
    // EM PRODUÇÃO: Implemente o envio real aqui, usando um serviço como SendGrid, AWS SES, etc.
    // Exemplo de como poderia ser implementado com o Resend:
    //
    // const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    // const emailResult = await resend.emails.send({
    //   from: 'RH Mentor Mastery <no-reply@rhmentormastery.com>',
    //   to: [data.email],
    //   subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
    //   html: emailBody.replace(/\n/g, '<br>'),
    // });
    //
    // console.log("Resultado do envio:", emailResult);
    
    // Registrar os dados que seriam enviados em um ambiente real
    console.log({
      to: data.email,
      subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
      content: emailBody
    });
    
    // Simular uma resposta bem-sucedida
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'E-mail enviado com sucesso (simulação)',
        timestamp: new Date().toISOString()
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Tratar erros
    console.error('Erro ao enviar e-mail:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Falha ao processar solicitação de envio de e-mail',
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
