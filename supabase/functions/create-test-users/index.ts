
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Criar cliente supabase com a chave de serviço para ter permissões administrativas
    const supabaseAdminUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    if (!supabaseAdminUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ 
          error: "Configurações de ambiente ausentes" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const supabaseAdmin = createClient(supabaseAdminUrl, supabaseServiceKey);

    // Criar usuário mentor (admin)
    const adminEmail = "admin@example.com";
    const { data: existingAdmin } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", adminEmail)
      .maybeSingle();

    if (!existingAdmin) {
      // Criar usuário mentor
      const { data: adminUser, error: adminError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: "admin1234",
        email_confirm: true,
        user_metadata: {
          name: "Administrador",
          role: "mentor"
        }
      });

      if (adminError) {
        console.error("Erro ao criar mentor:", adminError);
        throw adminError;
      }

      console.log("Mentor criado com sucesso:", adminUser);
    } else {
      console.log("Mentor já existe");
    }

    // Criar usuário cliente
    const clientEmail = "cliente@example.com";
    const { data: existingClient } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("email", clientEmail)
      .maybeSingle();

    if (!existingClient) {
      // Criar usuário cliente
      const { data: clientUser, error: clientError } = await supabaseAdmin.auth.admin.createUser({
        email: clientEmail,
        password: "teste1234",
        email_confirm: true,
        user_metadata: {
          name: "Cliente Teste",
          role: "client",
          company: "Empresa Teste"
        }
      });

      if (clientError) {
        console.error("Erro ao criar cliente:", clientError);
        throw clientError;
      }

      console.log("Cliente criado com sucesso:", clientUser);
    } else {
      console.log("Cliente já existe");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Usuários de teste criados com sucesso" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
