
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import { corsHeaders } from "../send-invite-email/types.ts";
import { buildInviteEmailHtml } from "../send-invite-email/emailBuilder.ts";
import { sendWithGoDaddy } from "../send-invite-email/emailServices.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function handleRequest(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Verificar credenciais SMTP
    const smtpUsername = Deno.env.get("SMTP_USERNAME");
    const smtpPassword = Deno.env.get("SMTP_PASSWORD");
    
    if (!smtpUsername || !smtpPassword) {
      console.error("Credenciais SMTP não configuradas");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Configuração de e-mail ausente. Contate o administrador do sistema."
        }),
        { 
          status: 200, 
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }

    // Obter ID do convite a ser reenviado
    const { inviteId } = await req.json();
    
    if (!inviteId) {
      return new Response(
        JSON.stringify({ success: false, error: "ID do convite não fornecido" }),
        { 
          status: 200, 
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Buscar informações do convite e mentor
    const { data: inviteData, error: inviteError } = await supabase
      .from("invitation_codes")
      .select(`
        *,
        mentor:profiles!invitation_codes_mentor_id_fkey(name, company)
      `)
      .eq("id", inviteId)
      .single();
    
    if (inviteError || !inviteData) {
      console.error("Erro ao buscar convite:", inviteError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Convite não encontrado",
          details: inviteError
        }),
        { 
          status: 200, 
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Atualizar data de expiração do convite (7 dias a partir de agora)
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    
    const { error: updateError } = await supabase
      .from("invitation_codes")
      .update({
        is_used: false,
        expires_at: expirationDate.toISOString()
      })
      .eq("id", inviteId);
    
    if (updateError) {
      console.error("Erro ao atualizar convite:", updateError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Erro ao atualizar convite",
          details: updateError
        }),
        { 
          status: 200, 
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
    
    // Preparar e-mail de convite
    const email = inviteData.email;
    const clientName = email.split('@')[0]; // Caso não tenhamos nome do cliente, usar parte do email
    const mentorName = inviteData.mentor?.name || "Mentor";
    const mentorCompany = inviteData.mentor?.company || "RH Mentor Mastery";
    
    const htmlContent = buildInviteEmailHtml(
      clientName,
      mentorName,
      mentorCompany
    );
    
    const subject = `Convite para plataforma ${mentorCompany}`;
    
    // Enviar e-mail de convite
    try {
      const emailResult = await sendWithGoDaddy(
        email,
        subject,
        htmlContent,
        smtpUsername,
        smtpPassword
      );
      
      if (!emailResult.success) {
        console.error("Erro ao enviar e-mail:", emailResult.errorMessage);
        return new Response(
          JSON.stringify({ 
            success: false, 
            error: "Falha ao enviar e-mail",
            details: emailResult.errorMessage,
            isSmtpError: true
          }),
          { 
            status: 200, 
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `E-mail de convite reenviado para ${email}`,
          service: "GoDaddy"
        }),
        { 
          status: 200, 
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    } catch (emailError) {
      console.error("Exceção ao enviar e-mail:", emailError);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Erro ao processar envio de e-mail",
          details: emailError.message,
          isSmtpError: true
        }),
        { 
          status: 200, 
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        }
      );
    }
  } catch (error) {
    console.error("Erro na função resend-invitation:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Erro interno no servidor",
        details: error.message
      }),
      { 
        status: 200, 
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
}

serve(handleRequest);
