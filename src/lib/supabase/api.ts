
import { supabase } from './client';
import type { Database } from '@/integrations/supabase/types';

// Define available table names as a type
type TableName = 'profiles' | 'invitation_codes' | 'invites' | 'mentors' | 'tests' | 
                'test_results' | 'client_tests' | 'user_roles' | 'animal_profile_answers' | 
                'animal_profile_questions' | 'animal_profile_results';

export const SupabaseAPI = {
  getById: async <T>(table: TableName, id: string): Promise<T> => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data as T;
  },
  
  getMany: async <T>(table: TableName, options?: {
    select?: string;
    filters?: Record<string, unknown>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
  }): Promise<T[]> => {
    let query = supabase.from(table).select(options?.select || '*');
    
    if (options?.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }
    
    if (options?.order) {
      query = query.order(options.order.column, { 
        ascending: options.order.ascending ?? true 
      });
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as T[];
  },
  
  insert: async <T>(table: TableName, data: Record<string, unknown>): Promise<T> => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data as any)
      .select()
      .single();
      
    if (error) throw error;
    return result as T;
  },
  
  update: async <T>(table: TableName, id: string, data: Record<string, unknown>): Promise<T> => {
    const { data: result, error } = await supabase
      .from(table)
      .update(data as any)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return result as T;
  },
  
  delete: async (table: TableName, id: string): Promise<boolean> => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },
  
  invokeFunction: async <T>(functionName: string, payload?: unknown): Promise<T> => {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });
    
    if (error) throw error;
    return data as T;
  }
};
