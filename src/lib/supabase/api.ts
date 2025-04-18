
import { supabase } from './client';

export const SupabaseAPI = {
  getById: async (table: string, id: string) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  
  getMany: async (table: string, options?: {
    select?: string;
    filters?: Record<string, unknown>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
  }) => {
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
    return data || [];
  },
  
  insert: async (table: string, data: Record<string, unknown>) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select()
      .single();
      
    if (error) throw error;
    return result;
  },
  
  update: async (table: string, id: string, data: Record<string, unknown>) => {
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return result;
  },
  
  delete: async (table: string, id: string) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  },
  
  invokeFunction: async (functionName: string, payload?: unknown) => {
    const { data, error } = await supabase.functions.invoke(functionName, {
      body: payload
    });
    
    if (error) throw error;
    return data;
  }
};
