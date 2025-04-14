
// Declarações de tipos para o ambiente Deno
declare global {
  interface DenoNamespace {
    env: {
      get(key: string): string | undefined;
    };
  }
  const Deno: DenoNamespace;
}

// Interface para os dados do corpo da requisição
export interface InviteEmailData {
  email: string;
  clientName?: string;
  mentorName: string;
  mentorCompany: string;
}

// Configuração de cabeçalhos CORS
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

