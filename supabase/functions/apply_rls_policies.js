
// Este script pode ser executado manualmente no console do Supabase
// para aplicar as políticas RLS

// Aplicar políticas RLS para a tabela profiles
async function applyRlsPolicies() {
  try {
    // Ative RLS na tabela de perfis
    await supabase.rpc('exec', {
      sql: "ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;"
    });
    
    // Usuários podem ver seus próprios perfis
    await supabase.rpc('exec', {
      sql: `CREATE POLICY "Usuários podem ver seu próprio perfil" 
          ON public.profiles
          FOR SELECT
          USING (auth.uid() = id);`
    });
    
    // Usuários podem atualizar seus próprios perfis
    await supabase.rpc('exec', {
      sql: `CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
          ON public.profiles
          FOR UPDATE
          USING (auth.uid() = id);`
    });
    
    // Usuários podem inserir seus próprios perfis
    await supabase.rpc('exec', {
      sql: `CREATE POLICY "Usuários podem inserir seu próprio perfil" 
          ON public.profiles
          FOR INSERT
          WITH CHECK (auth.uid() = id);`
    });
    
    // Mentores podem ver perfis de seus clientes
    await supabase.rpc('exec', {
      sql: `CREATE POLICY "Mentores podem ver perfis de seus clientes" 
          ON public.profiles
          FOR SELECT
          USING (auth.uid() = mentor_id);`
    });
    
    console.log("Políticas RLS aplicadas com sucesso!");
  } catch (error) {
    console.error("Erro ao aplicar políticas RLS:", error);
  }
}
