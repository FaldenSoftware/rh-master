import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { errorResponse } from "./errorHandler.ts";
import { responseWithCORS } from "./responseFormatter.ts";
import { buildInviteEmailHtml } from "./emailBuilder.ts";

// Configurações SMTP fixas conforme solicitado
const SMTP_CONFIG = {
  host: "smtpout.secureserver.net",
  port: 465,
  username: "contato@rhmaster.space",
  displayName: "contato",
  password: "Andre1!)%&&%",
  secure: true
};

async function handleRequest(req: Request): Promise<Response> {
  try {
    // Configuração do cliente Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      return errorResponse("Configuração do Supabase ausente", { isConfigError: true });
    }
    
    // Cliente para operações autenticadas
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    if (req.method === "OPTIONS") {
      return responseWithCORS(new Response(null, { status: 204 }));
    }

    if (req.method !== "POST") {
      return errorResponse("Método não permitido. Use POST.");
    }
    
    // Verificar autenticação do usuário
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return errorResponse("Autenticação necessária", { status: 401 });
    }
    
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return errorResponse("Usuário não autenticado", { status: 401, error: authError });
    }

    // Parse request body
    const requestData = await req.json();
    const { inviteId } = requestData;
    
    if (!inviteId) {
      return errorResponse("ID do convite é obrigatório");
    }
    
    // Obter dados do convite
    const { data: invite, error: inviteError } = await supabase
      .from('invites')
      .select('*, profiles!mentor_id(*)')
      .eq('id', inviteId)
      .single();
    
    if (inviteError || !invite) {
      return errorResponse("Convite não encontrado", { 
        status: 404, 
        error: inviteError 
      });
    }
    
    // Verificar se o usuário é o mentor do convite ou um administrador
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    
    const isAdmin = userProfile?.role === 'admin';
    const isMentor = invite.mentor_id === user.id;
    
    if (!isAdmin && !isMentor) {
      return errorResponse("Você não tem permissão para enviar este convite", { status: 403 });
    }
    
    // Gerar link de aceitação do convite
    const baseUrl = Deno.env.get("SITE_URL") || "https://rhmaster.space";
    const acceptUrl = `${baseUrl}/register?invite=${inviteId}`;
    
    // Preparar dados para o email
    const mentorName = invite.profiles?.name || "Seu mentor";
    const mentorCompany = "RH Mentor Mastery";
    const clientName = invite.name || "Cliente";
    const clientEmail = invite.email;
    
    // Construir o conteúdo do email
    const subject = `Convite para participar da plataforma ${mentorCompany}`;
    const htmlContent = buildInviteEmailHtml(clientName, mentorName, mentorCompany, acceptUrl);
    
    console.log(`Tentando enviar email para ${clientEmail}`);
    
    // Enviar email via SMTP
    try {
      const client = new SmtpClient();
      
      await client.connect({
        hostname: SMTP_CONFIG.host,
        port: SMTP_CONFIG.port,
        username: SMTP_CONFIG.username,
        password: SMTP_CONFIG.password,
        tls: SMTP_CONFIG.secure,
      });
      
      const fromEmail = `"${SMTP_CONFIG.displayName}" <${SMTP_CONFIG.username}>`;
      
      await client.send({
        from: fromEmail,
        to: clientEmail,
        subject: subject,
        content: htmlContent,
        html: htmlContent,
      });
      
      await client.close();
      
      // Atualizar status do convite após o envio bem-sucedido
      await supabase
        .from('invites')
        .update({ 
          status: 'sent', 
          updated_at: new Date().toISOString(),
          sent_at: new Date().toISOString()
        })
        .eq('id', inviteId);
      
      // Resposta de sucesso
      return responseWithCORS(
        new Response(
          JSON.stringify({
            success: true,
            message: `Email de convite enviado com sucesso para ${clientEmail}`,
            email: clientEmail,
            inviteId: inviteId
          }),
          { status: 200 }
        )
      );
    } catch (emailError) {
      console.error("Erro no envio de email:", emailError);
      
      // Atualizar status do convite em caso de falha
      await supabase
        .from('invites')
        .update({ 
          status: 'error', 
          updated_at: new Date().toISOString(),
          error_message: emailError.message || "Erro ao enviar email"
        })
        .eq('id', inviteId);
      
      return errorResponse("Erro ao processar o envio de email", {
        error: emailError,
        isSmtpError: true
      });
    }
  } catch (error) {
    console.error("Erro inesperado:", error);
    return errorResponse("Erro interno do servidor", { error, isSmtpError: false });
  }
}

serve(handleRequest);
