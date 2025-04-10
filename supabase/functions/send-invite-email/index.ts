
// Supabase Edge Function para enviar e-mails de convite
// @ts-ignore: Ignorando erro de importação do Deno em ambiente de desenvolvimento
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';

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
      return new Response(
        JSON.stringify({ error: 'Método não permitido' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obter dados do corpo da requisição
    const data = await req.json() as InviteEmailData;
    
    // Log all incoming data for debugging
    console.log("Dados recebidos:", JSON.stringify(data));
    
    // Validar dados obrigatórios
    if (!data.email || !data.code) {
      const errorMsg = 'Email e código são obrigatórios';
      console.error(errorMsg, { email: data.email, code: data.code });
      return new Response(
        JSON.stringify({ error: errorMsg }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Inicializar cliente Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY não está configurada nas variáveis de ambiente');
      throw new Error('Configuração de e-mail ausente. Contate o administrador do sistema.');
    }
    
    console.log("Resend API Key encontrada, comprimento:", resendApiKey.length);
    
    const resend = new Resend(resendApiKey);
    
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
    
    // Registrar os dados que serão enviados
    console.log(`Enviando e-mail para ${data.email} com código ${data.code}`);
    
    try {
      // Enviar e-mail usando Resend
      const emailResponse = await resend.emails.send({
        from: 'RH Mentor Mastery <onboarding@resend.dev>',
        to: [data.email],
        subject: `Convite para RH Mentor Mastery de ${data.mentorCompany}`,
        html: htmlContent
      });
      
      // Registrar resposta do Resend
      console.log('Resposta do Resend:', JSON.stringify(emailResponse));

      // Verificar se o e-mail foi enviado com sucesso
      if (!emailResponse?.id) {
        console.error('Erro ao enviar e-mail:', emailResponse);
        throw new Error('Falha ao enviar e-mail através do Resend');
      }

      // Retornar sucesso
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'E-mail enviado com sucesso',
          id: emailResponse.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (emailError) {
      console.error('Erro específico ao enviar email com Resend:', emailError);
      throw emailError;
    }
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
