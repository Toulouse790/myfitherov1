
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface GenericStringError {
  message: string;
}

export async function fetchData<T>(
  table: string,
  options: {
    select?: string;
    filters?: Record<string, any>;
    order?: { column: string; ascending?: boolean };
    limit?: number;
    single?: boolean;
  } = {}
) {
  try {
    let query = supabase.from(table).select(options.select || '*');

    if (options.filters) {
      Object.entries(options.filters).forEach(([key, value]) => {
        if (value !== undefined) {
          query = query.eq(key, value);
        }
      });
    }

    if (options.order) {
      query = query.order(options.order.column, {
        ascending: options.order.ascending ?? true,
      });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = options.single
      ? await query.maybeSingle()
      : await query;

    return {
      data: data as T,
      error: error as PostgrestError,
    };
  } catch (error) {
    return {
      data: null as T,
      error: error as PostgrestError,
    };
  }
}
