
import { supabase } from './client';
import { PostgrestError } from '@supabase/supabase-js';

export const fetchWithErrorHandling = async <T>(
  promise: Promise<{ data: T | null; error: PostgrestError | null }>
) => {
  try {
    const { data, error } = await promise;
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('API Error:', error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
};

export const api = {
  async selectFrom<T>(
    table: string,
    options: {
      select?: string;
      match?: Record<string, any>;
      single?: boolean;
    } = {}
  ) {
    try {
      let query = supabase.from(table).select(options.select || '*');

      if (options.match) {
        Object.entries(options.match).forEach(([key, value]) => {
          query = query.eq(key, value);
        });
      }

      const { data, error } = options.single
        ? await query.maybeSingle()
        : await query;

      if (error) throw error;

      return {
        data: data as T,
        error: null
      };
    } catch (error) {
      console.error(`Error fetching from ${table}:`, error);
      return {
        data: null,
        error: error as PostgrestError
      };
    }
  }
};
