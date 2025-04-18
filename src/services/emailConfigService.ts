import { supabase } from "@/integrations/supabase/client";

/**
 * Verifica se as configurações de email estão disponíveis no Supabase
 */
export const checkEmailConfig = async (): Promise<{
  configured: boolean;
  error?: string;
}> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-email-config');

    if (error) {
      console.error("Erro ao verificar configuração de email:", error);
      return {
        configured: false,
        error: "Erro ao verificar configuração de email"
      };
    }

    return data || { configured: false };
  } catch (error) {
    console.error("Erro ao verificar configuração de email:", error);
    return {
      configured: false,
      error: "Erro ao verificar configuração de email"
    };
  }
};
