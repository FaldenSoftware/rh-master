
import { supabase } from './client';
import { ErrorService } from '@/services/errorService';
import type { Database } from '@/integrations/supabase/types';

type TableNames = keyof Database['public']['Tables'];
type TableRow<T extends TableNames> = Database['public']['Tables'][T]['Row'];

export class SupabaseAPI {
  static async getById<T = any>(table: TableNames, id: string): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as T;
    } catch (error) {
      ErrorService.logError('database_error', error, { table, id });
      throw error;
    }
  }

  static async getMany<T = any>(
    table: TableNames,
    options?: {
      select?: string;
      filters?: Record<string, any>;
      order?: { column: string; ascending?: boolean };
      limit?: number;
    }
  ): Promise<T[]> {
    try {
      let query = supabase.from(table).select(options?.select || '*');
      
      if (options?.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined) {
            query = query.eq(key, value);
          }
        });
      }
      
      if (options?.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? true });
      }
      
      if (options?.limit) {
        query = query.limit(options.limit);
      }
      
      const { data: result, error } = await query;
      
      if (error) throw error;
      return result as T[];
    } catch (error) {
      ErrorService.logError('database_error', error, { table, options });
      throw error;
    }
  }

  static async insert<T = any>(table: TableNames, data: any): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data as any)
        .select()
        .single();
        
      if (error) throw error;
      return result as T;
    } catch (error) {
      ErrorService.logError('database_error', error, { table, data });
      throw error;
    }
  }

  static async update<T = any>(table: TableNames, id: string, data: any): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data as any)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return result as T;
    } catch (error) {
      ErrorService.logError('database_error', error, { table, id, data });
      throw error;
    }
  }

  static async delete(table: TableNames, id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return true;
    } catch (error) {
      ErrorService.logError('database_error', error, { table, id });
      throw error;
    }
  }

  static async invokeFunction<T = any>(functionName: string, payload?: any): Promise<T> {
    try {
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: payload
      });
      
      if (error) throw error;
      return data as T;
    } catch (error) {
      ErrorService.logError('function_error', error, { functionName, payload });
      throw error;
    }
  }
}

