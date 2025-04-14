
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
    console.log("Dados recebidos:", JSON.stringify(rawData));
    
    // Normalizar os dados para garantir compatibilidade com diferentes formatos
    const data: InviteEmailData = {
      email: rawData.email || rawData.to || '',
      clientName: rawData.clientName || rawData.client_name || '',
      mentorName: rawData.mentorName || rawData.mentor_name || 'Seu mentor',
      mentorCompany: rawData.mentorCompany || rawData.mentor_company || 'RH Mentor Mastery'
    };
    
    // Validar dados obrigatórios
    if (!data.email) {
      const errorMsg = 'Email é obrigatório';
      console.error(errorMsg, { dados_recebidos: rawData });
      return new Response(
        JSON.stringify({ success: false, error: errorMsg }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se a chave Resend API está configurada
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY não está configurada nas variáveis de ambiente');
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Configuração de e-mail ausente. Contate o administrador do sistema para configurar a chave da API Resend.'
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log("Verificando API key do Resend...");
    
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
      // Inicializar cliente Resend
      const resend = new Resend(resendApiKey);
      
      console.log('Enviando email via Resend...');
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
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'E-mail enviado com sucesso via Resend',
            id: emailResponse.id
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.error('Erro na resposta do Resend:', emailResponse);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: 'Falha ao enviar e-mail. Resposta inválida da API Resend.'
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } catch (emailError) {
      console.error('Erro ao enviar email com Resend:', emailError);
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
    // Tratar erros gerais
    console.error('Erro geral ao processar requisição:', error);
    
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
