
import { supabase } from '@/lib/supabase/client';

export type ErrorType =
  | 'auth_error'
  | 'database_error'
  | 'network_error'
  | 'function_error'
  | 'validation_error'
  | 'unknown_error';

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

interface ErrorLogData {
  type: ErrorType;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  severity: ErrorSeverity;
  user_id?: string;
  timestamp: string;
}

export class ErrorService {
  static async logError(
    type: ErrorType,
    error: any,
    context?: Record<string, any>,
    logToDatabase = true
  ): Promise<void> {
    const message = error?.message || String(error);
    const stack = error?.stack;
    const severity = this.getSeverity(type);
    console.error(`[${type}][${severity}] ${message}`, { stack, context });
    let userId: string | undefined;
    try {
      const { data } = await supabase.auth.getUser();
      userId = data.user?.id;
    } catch (e) {}
    
    // For now, we'll just log to console since the error_logs table might not exist
    // If you want to store errors, create the table first
    console.error('Error details:', {
      type,
      message,
      stack,
      context,
      severity,
      user_id: userId,
      timestamp: new Date().toISOString()
    });
  }
  
  private static getSeverity(type: ErrorType): ErrorSeverity {
    switch (type) {
      case 'auth_error':
        return 'medium';
      case 'database_error':
        return 'high';
      case 'function_error':
        return 'high';
      case 'network_error':
        return 'medium';
      case 'validation_error':
        return 'low';
      case 'unknown_error':
        return 'critical';
      default:
        return 'medium';
    }
  }
  
  private static async notifyAdministrators(
    type: ErrorType,
    message: string,
    context?: Record<string, any>
  ): Promise<void> {
    console.warn('NOTIFICAÇÃO DE ERRO CRÍTICO:', {
      type,
      message,
      context,
      timestamp: new Date().toISOString()
    });
  }
  
  static getUserFriendlyMessage(error: any): string {
    if (error?.code) {
      switch (error.code) {
        case 'auth/invalid-email':
          return 'Email inválido. Verifique e tente novamente.';
        case 'auth/user-not-found':
          return 'Usuário não encontrado. Verifique suas credenciais.';
        case 'auth/wrong-password':
          return 'Senha incorreta. Tente novamente.';
        case '23505':
          return 'Este registro já existe.';
        case 'PGRST116':
          return 'Registro não encontrado.';
        default:
          if (error.message?.includes('SMTP')) {
            return 'Erro de configuração de email. Contate o administrador.';
          }
          if (error.message?.includes('network')) {
            return 'Erro de conexão. Verifique sua internet e tente novamente.';
          }
      }
    }
    return 'Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.';
  }
}
