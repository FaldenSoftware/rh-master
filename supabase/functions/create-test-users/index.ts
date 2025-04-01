
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
    const adminPassword = "admin1234";
    const adminName = "Administrador";
    const adminRole = "mentor";

    // Check if admin exists
    const { data: existingAdminUser } = await supabaseAdmin.auth.admin.listUsers();
    const adminExists = existingAdminUser?.users.some(user => user.email === adminEmail);

    if (!adminExists) {
      // Criar usuário admin no auth
      const { data: adminUser, error: adminAuthError } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true
      });

      if (adminAuthError) {
        console.error("Erro ao criar usuário mentor:", adminAuthError);
        throw adminAuthError;
      }

      // Criar perfil do mentor
      if (adminUser?.user) {
        const { error: adminProfileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: adminUser.user.id,
            name: adminName,
            role: adminRole
          });

        if (adminProfileError) {
          console.error("Erro ao criar perfil do mentor:", adminProfileError);
          // Try to rollback auth user if profile creation fails
          try {
            await supabaseAdmin.auth.admin.deleteUser(adminUser.user.id);
          } catch (e) {
            console.error("Falha ao excluir usuário auth após erro no perfil:", e);
          }
          throw adminProfileError;
        }

        console.log("Mentor criado com sucesso:", adminUser.user.email);
      }
    } else {
      console.log("Mentor já existe");
    }

    // Criar usuário cliente
    const clientEmail = "cliente@example.com";
    const clientPassword = "teste1234";
    const clientName = "Cliente Teste";
    const clientRole = "client";
    const clientCompany = "Empresa Teste";

    // Check if client exists
    const clientExists = existingAdminUser?.users.some(user => user.email === clientEmail);

    if (!clientExists) {
      // Criar usuário cliente no auth
      const { data: clientUser, error: clientAuthError } = await supabaseAdmin.auth.admin.createUser({
        email: clientEmail,
        password: clientPassword,
        email_confirm: true
      });

      if (clientAuthError) {
        console.error("Erro ao criar usuário cliente:", clientAuthError);
        throw clientAuthError;
      }

      // Criar perfil do cliente
      if (clientUser?.user) {
        const { error: clientProfileError } = await supabaseAdmin
          .from("profiles")
          .insert({
            id: clientUser.user.id,
            name: clientName,
            role: clientRole,
            company: clientCompany
          });

        if (clientProfileError) {
          console.error("Erro ao criar perfil do cliente:", clientProfileError);
          // Try to rollback auth user if profile creation fails
          try {
            await supabaseAdmin.auth.admin.deleteUser(clientUser.user.id);
          } catch (e) {
            console.error("Falha ao excluir usuário auth após erro no perfil:", e);
          }
          throw clientProfileError;
        }

        console.log("Cliente criado com sucesso:", clientUser.user.email);
      }
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
