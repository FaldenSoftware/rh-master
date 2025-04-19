import { supabase } from "@/integrations/supabase/client";

/**
 * Verifica se as políticas RLS estão funcionando corretamente
 */
export async function verifyRlsPolicies() {
  try {
    console.log("Verificando políticas RLS...");
    
    // Obter ID do usuário atual
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    
    if (!userId) {
      return { success: false, error: "Usuário não autenticado" };
    }
    
    // Teste 1: Verificar se um mentor pode ver seus clientes via RPC
    const { data: clientsData, error: clientsError } = await supabase
      .rpc('get_mentor_clients', { 
        input_mentor_id: userId
      });
      
    console.log("Teste 1 - Clientes encontrados via RPC:", clientsData?.length || 0);
    if (clientsError) {
      console.error("Teste 1 falhou:", clientsError);
    }
    
    // Teste 2: Verificar consulta direta à tabela profiles
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('mentor_id', userId)
      .eq('role', 'client');
      
    console.log("Teste 2 - Perfis encontrados via consulta direta:", profilesData?.length || 0);
    if (profilesError) {
      console.error("Teste 2 falhou:", profilesError);
    }
    
    // Teste 3: Verificar se o convite pode ser criado
    let inviteTest = { success: true, error: null };
    try {
      const testEmail = `test_${Date.now()}@example.com`;
      const { data: inviteData, error: inviteError } = await supabase
        .from('invitation_codes')
        .insert({
          code: Math.random().toString(36).substring(2, 10),
          mentor_id: userId,
          email: testEmail,
          is_used: false,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        })
        .select();
        
      if (inviteError) {
        console.error("Teste 3 falhou:", inviteError);
        inviteTest = { success: false, error: inviteError };
      } else {
        // Limpar o convite de teste
        await supabase
          .from('invitation_codes')
          .delete()
          .eq('email', testEmail);
      }
    } catch (error) {
      console.error("Erro no teste 3:", error);
      inviteTest = { success: false, error };
    }
    
    return {
      success: !clientsError && !profilesError && inviteTest.success,
      clientsCount: clientsData?.length || 0,
      profilesCount: profilesData?.length || 0,
      inviteTest: inviteTest.success ? "Sucesso" : "Falha",
      inviteError: inviteTest.error
    };
  } catch (error) {
    console.error("Erro ao verificar políticas RLS:", error);
    return { success: false, error };
  }
}
