import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixProfilesPolicies() {
  try {
    console.log('Iniciando correção das políticas RLS da tabela profiles...');
    if (!supabaseServiceKey) {
      console.error('Erro: SUPABASE_SERVICE_KEY não encontrada no .env');
      console.log('Por favor, adicione a chave de serviço ao arquivo .env:');
      console.log('SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
      return;
    }
    await checkProfilesTableStructure();
    await disableExistingPolicies();
    await createNewPolicies();
    console.log('Correção das políticas RLS concluída com sucesso!');
    await testPolicies();
  } catch (error) {
    console.error('Erro ao corrigir políticas RLS:', error);
  }
}

async function checkProfilesTableStructure() {
  try {
    console.log('Verificando estrutura da tabela profiles...');
    const { data, error } = await supabaseAdmin.rpc('check_table_structure', {
      table_name: 'profiles'
    });
    if (error) {
      console.error('Erro ao verificar estrutura da tabela:', error);
      console.log('Crie manualmente a função check_table_structure conforme instruções no README.');
      return;
    }
    console.log('Estrutura da tabela profiles:');
    console.log(data);
    const requiredColumns = ['id', 'name', 'email', 'role', 'mentor_id', 'created_at', 'updated_at'];
    const missingColumns = [];
    for (const column of requiredColumns) {
      if (!data.some(col => col.column_name === column)) {
        missingColumns.push(column);
      }
    }
    if (missingColumns.length > 0) {
      console.error('Colunas ausentes na tabela profiles:', missingColumns);
      console.log('Por favor, adicione as colunas ausentes antes de prosseguir.');
    } else {
      console.log('Todas as colunas necessárias estão presentes.');
    }
  } catch (error) {
    console.error('Erro ao verificar estrutura da tabela:', error);
  }
}

async function disableExistingPolicies() {
  try {
    const { data: policies, error } = await supabaseAdmin.rpc('get_policies', {
      table_name: 'profiles'
    });
    if (error) {
      console.error('Erro ao obter políticas existentes:', error);
      console.log('Crie manualmente a função get_policies conforme instruções no README.');
      return;
    }
    console.log('Políticas existentes:', policies);
    for (const policy of policies || []) {
      console.log(`Desativando política: ${policy.policyname}`);
      const dropPolicySQL = `DROP POLICY IF EXISTS "${policy.policyname}" ON profiles;`;
      const { error: dropError } = await supabaseAdmin.rpc('exec_sql', {
        sql: dropPolicySQL
      });
      if (dropError) {
        console.error(`Erro ao desativar política ${policy.policyname}:`, dropError);
      }
    }
  } catch (error) {
    console.error('Erro ao desativar políticas existentes:', error);
  }
}

async function createNewPolicies() {
  try {
    const policy1SQL = `CREATE POLICY "Usuários podem ver seus próprios perfis" ON profiles FOR SELECT USING (auth.uid() = id);`;
    const policy2SQL = `CREATE POLICY "Mentores podem ver seus clientes" ON profiles FOR SELECT USING ((role = 'client' AND mentor_id = auth.uid()));`;
    const policy3SQL = `CREATE POLICY "Administradores podem ver todos os perfis" ON profiles FOR ALL USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));`;
    const policy4SQL = `CREATE POLICY "Permitir inserção de novos perfis" ON profiles FOR INSERT WITH CHECK (true);`;
    const policy5SQL = `CREATE POLICY "Usuários podem atualizar seus próprios perfis" ON profiles FOR UPDATE USING (auth.uid() = id);`;
    const policy6SQL = `CREATE POLICY "Mentores podem atualizar seus clientes" ON profiles FOR UPDATE USING ((role = 'client' AND mentor_id = auth.uid()));`;
    const policies = [policy1SQL, policy2SQL, policy3SQL, policy4SQL, policy5SQL, policy6SQL];
    for (let i = 0; i < policies.length; i++) {
      console.log(`Criando política ${i + 1}...`);
      const { error } = await supabaseAdmin.rpc('exec_sql', {
        sql: policies[i]
      });
      if (error) {
        console.error(`Erro ao criar política ${i + 1}:`, error);
      }
    }
  } catch (error) {
    console.error('Erro ao criar novas políticas:', error);
  }
}

async function testPolicies() {
  try {
    console.log('Testando políticas...');
    const { data: userProfile, error: userError } = await supabaseAdmin.auth.getUser();
    if (userError) {
      console.error('Erro ao obter usuário atual:', userError);
      return;
    }
    const userId = userProfile.user?.id;
    if (!userId) {
      console.error('Usuário não autenticado');
      return;
    }
    console.log(`Testando acesso ao próprio perfil (ID: ${userId})...`);
    const { data: ownProfile, error: ownProfileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (ownProfileError) {
      console.error('Erro ao acessar próprio perfil:', ownProfileError);
    } else {
      console.log('Acesso ao próprio perfil: OK');
      console.log(ownProfile);
    }
    if (ownProfile && ownProfile.role === 'mentor') {
      console.log('Testando acesso a clientes como mentor...');
      const { data: clients, error: clientsError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('mentor_id', userId)
        .eq('role', 'client');
      if (clientsError) {
        console.error('Erro ao acessar clientes como mentor:', clientsError);
      } else {
        console.log(`Acesso a clientes como mentor: OK (${clients.length} clientes encontrados)`);
      }
    }
  } catch (error) {
    console.error('Erro ao testar políticas:', error);
  }
}

fixProfilesPolicies();

export {
  fixProfilesPolicies,
  checkProfilesTableStructure,
  disableExistingPolicies,
  createNewPolicies,
  testPolicies
};
