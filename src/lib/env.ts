export interface EnvCheckResult {
  valid: boolean;
  missing: string[];
  warnings: string[];
}

export function validateEnvironment(): EnvCheckResult {
  const requiredVars = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  const warningVars = [
    'VITE_APP_URL'
  ];
  const missing = requiredVars.filter(varName => !import.meta.env[varName]);
  const warnings = warningVars.filter(varName => !import.meta.env[varName]);
  return {
    valid: missing.length === 0,
    missing,
    warnings
  };
}

export function initializeApp(): boolean {
  console.log('Inicializando aplicação...');
  const envCheck = validateEnvironment();
  if (!envCheck.valid) {
    console.error(
      `Erro de configuração: Variáveis de ambiente ausentes: ${envCheck.missing.join(', ')}`
    );
    document.body.innerHTML = `
      <div style="padding: 20px; color: red; text-align: center;">
        <h1>Erro de Configuração</h1>
        <p>O aplicativo não pode ser inicializado devido a configurações ausentes.</p>
        <p>Variáveis ausentes: ${envCheck.missing.join(', ')}</p>
        <p>Por favor, contate o administrador do sistema.</p>
      </div>
    `;
    return false;
  }
  if (envCheck.warnings.length > 0) {
    console.warn(
      `Aviso de configuração: Variáveis de ambiente opcionais ausentes: ${envCheck.warnings.join(', ')}`
    );
  }
  console.log('Inicialização concluída com sucesso');
  return true;
}
