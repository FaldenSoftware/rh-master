import { fixProfilesPolicies } from './fix-supabase-policies.js';

fixProfilesPolicies()
  .then(() => {
    console.log('Script de correção concluído.');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erro ao executar script de correção:', error);
    process.exit(1);
  });
