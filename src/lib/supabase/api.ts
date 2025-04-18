
import { supabase } from './client';
import { ErrorService } from '@/services/errorService';
import { Database } from '@/integrations/supabase/types';

// Define valid table names type to avoid type errors
type TableNames = keyof Database['public']['Tables'];

// Create a type for all table row types from the Database type
type TableRow<T extends TableNames> = Database['public']['Tables'][T]['Row'];

export class SupabaseAPI {
  static async getById<T extends TableRow<TableNames>>(table: TableNames, id: string): Promise<T | null> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();
      if (error) {
        ErrorService.logError('database_error', error, { table, id });
        throw error;
      }
      return data as T;
    } catch (error) {
      ErrorService.logError('database_error', error, { table, id });
      throw error;
    }
  }

  static async getMany<T extends TableRow<TableNames>>(
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
      const { data, error } = await query;
      if (error) {
        ErrorService.logError('database_error', error, { table, options });
        throw error;
      }
      return data as T[];
    } catch (error) {
      ErrorService.logError('database_error', error, { table, options });
      throw error;
    }
  }

  static async insert<T extends Record<string, any>>(table: TableNames, data: any): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert(data)
        .select()
        .single();
      if (error) {
        ErrorService.logError('database_error', error, { table, data });
        throw error;
      }
      return result as T;
    } catch (error) {
      ErrorService.logError('database_error', error, { table, data });
      throw error;
    }
  }

  static async update<T extends Record<string, any>>(table: TableNames, id: string, data: any): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      if (error) {
        ErrorService.logError('database_error', error, { table, id, data });
        throw error;
      }
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
      if (error) {
        ErrorService.logError('database_error', error, { table, id });
        throw error;
      }
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
      if (error) {
        ErrorService.logError('function_error', error, { functionName, payload });
        throw error;
      }
      return data as T;
    } catch (error) {
      ErrorService.logError('function_error', error, { functionName, payload });
      throw error;
    }
  }
}
