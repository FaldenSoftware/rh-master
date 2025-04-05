
import { InvitationCode } from "@/types/models";

// Utilities for generating and validating invitation codes

/**
 * Generates a secure random invitation code with 12 characters
 * Includes uppercase, lowercase, and special characters
 */
export const generateInvitationCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*-_=+';
  let result = '';
  const length = 12;
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Validates an invitation code format
 * Must be 12 characters long and contain a mix of characters
 */
export const isValidCodeFormat = (code: string): boolean => {
  if (!code || code.length !== 12) return false;
  
  // Check if code contains at least one letter (upper or lower case)
  // and at least one digit or special character
  const hasLetter = /[a-zA-Z]/.test(code);
  const hasDigitOrSpecial = /[0-9!@#$%^&*\-_=+]/.test(code);
  
  return hasLetter && hasDigitOrSpecial;
};

/**
 * Verify invitation code with Supabase
 * @returns Object containing success status and message/data
 */
export const verifyInvitationCode = async (
  code: string,
  supabaseClient: any
): Promise<{ valid: boolean; message?: string; data?: InvitationCode }> => {
  try {
    if (!isValidCodeFormat(code)) {
      return { valid: false, message: "Formato de código inválido" };
    }
    
    // Use the raw query method to avoid type issues
    const { data, error } = await supabaseClient
      .from('invitation_codes')
      .select('*')
      .eq('code', code)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (error) {
      console.error("Erro ao verificar código:", error);
      return { valid: false, message: "Código inválido ou expirado" };
    }
    
    if (!data) {
      return { valid: false, message: "Código inválido ou expirado" };
    }
    
    return { valid: true, data: data as InvitationCode };
  } catch (error) {
    console.error("Erro ao verificar código:", error);
    return { valid: false, message: "Erro ao verificar código" };
  }
};
