import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// Garante fetch global para Node.js
if (!(globalThis as any).fetch) {
  (globalThis as any).fetch = fetch;
}

// Caminho para o MCP config
const mcpConfigPath = path.resolve(
  process.env.HOME || '',
  '.codeium/windsurf/mcp_config.json'
);

if (!fs.existsSync(mcpConfigPath)) {
  console.error('Arquivo mcp_config.json não encontrado:', mcpConfigPath);
  process.exit(1);
}

const mcpConfig = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf-8'));
const { url, anon_key } = mcpConfig.supabase;

if (!url || !anon_key) {
  console.error('Configuração do Supabase inválida no MCP config.');
  process.exit(1);
}

const supabase = createClient(url, anon_key);

async function testConnection() {
  // Testa acesso à API do Supabase (pode ser alterado para uma tabela existente)
  const { data, error } = await supabase.from('profiles').select('*').limit(1);

  if (error) {
    console.error('Erro ao acessar o Supabase:', error.message);
    process.exit(1);
  }
  console.log('Conexão com Supabase bem-sucedida! Exemplo de dados:', data);
}

testConnection();
