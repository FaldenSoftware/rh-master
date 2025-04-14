
// Supabase Edge Function para enviar e-mails de convite
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from './types.ts';
import { handleInviteEmailRequest } from './requestHandler.ts';

// Função principal que será executada pelo Supabase Edge Functions
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  return handleInviteEmailRequest(req);
});
