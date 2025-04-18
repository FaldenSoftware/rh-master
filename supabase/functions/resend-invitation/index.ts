
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { buildInviteEmailHtml } from "./emailBuilder.ts";
import { sendWithGoDaddy } from "./emailServices.ts";

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const smtpUsername = Deno.env.get('SMTP_USERNAME') || '';
const smtpPassword = Deno.env.get('SMTP_PASSWORD') || '';

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Define handler function
serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!smtpUsername || !smtpPassword) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Configuração de SMTP não definida',
          errorDetails: { isSmtpError: true }
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    const { inviteId } = await req.json();

    if (!inviteId) {
      return new Response(
        JSON.stringify({ success: false, error: 'ID do convite não fornecido' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 400 }
      );
    }

    // Get invitation details
    const { data: invite, error: getError } = await supabase
      .from('invitation_codes')
      .select('*, mentor:mentor_id(name)')
      .eq('id', inviteId)
      .single();

    if (getError || !invite) {
      console.error("Erro ao buscar convite:", getError);
      return new Response(
        JSON.stringify({ success: false, error: getError?.message || 'Convite não encontrado' }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 404 }
      );
    }

    // Update expiration date
    const newExpirationDate = new Date();
    newExpirationDate.setDate(newExpirationDate.getDate() + 7);
    
    const { error: updateError } = await supabase
      .from('invitation_codes')
      .update({
        is_used: false,
        expires_at: newExpirationDate.toISOString()
      })
      .eq('id', inviteId);

    if (updateError) {
      console.error("Erro ao atualizar convite:", updateError);
      return new Response(
        JSON.stringify({ success: false, error: updateError.message }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    // Send email
    const clientName = invite.name || '';
    const mentorName = invite.mentor?.name || 'Mentor';
    const mentorCompany = 'RH Mentor Mastery'; // Default company name
    
    const emailHtml = buildInviteEmailHtml(clientName, mentorName, mentorCompany);
    
    const emailResult = await sendWithGoDaddy(
      invite.email,
      'Convite para a RH Mentor Mastery',
      emailHtml,
      smtpUsername,
      smtpPassword
    );

    if (!emailResult.success) {
      console.error("Erro ao enviar email:", emailResult);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Erro ao enviar email',
          errorDetails: emailResult,
          isSmtpError: true,
          service: emailResult.service
        }),
        { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Convite reenviado com sucesso',
        service: emailResult.service
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error) {
    console.error("Erro não tratado:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Erro interno do servidor',
        errorDetails: error
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders }, status: 500 }
    );
  }
});
