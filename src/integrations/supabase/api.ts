
import { PostgrestError, PostgrestFilterBuilder, PostgrestQueryBuilder } from '@supabase/postgrest-js';
import { supabase } from './client';
import { refreshSession } from './auth';

type SupabaseResponse<T> = Promise<{
  data: T | null;
  error: PostgrestError | null;
}>;

// Interface plus simple pour éviter les erreurs de type
export const supabaseApi = {
  // Méthode pour exécuter une requête avec retry automatique en cas d'erreur d'authentification
  executeWithRetry: async <T>(
    queryFn: () => SupabaseResponse<T>
  ): SupabaseResponse<T> => {
    try {
      const { data, error } = await queryFn();
      
      if (error && (
        error.code === 'PGRST301' || 
        error.code === '401' ||
        (typeof error.message === 'string' && error.message.includes('JWT'))
      )) {
        console.log('Session expirée, tentative de rafraîchissement...');
        await refreshSession();
        return await queryFn();
      }
      
      return { data, error };
    } catch (e) {
      console.error('Erreur lors de l\'exécution de la requête:', e);
      return { 
        data: null, 
        error: e instanceof PostgrestError ? e : new PostgrestError('Erreur inconnue', '500') 
      };
    }
  },

  // Méthode pour faire une requête select avec retry
  select: async <T>(
    table: string, 
    columns: string = '*',
    filters?: (query: PostgrestFilterBuilder<any, any, T[]>) => PostgrestFilterBuilder<any, any, T[]>
  ): SupabaseResponse<T[]> => {
    return await supabaseApi.executeWithRetry(async () => {
      let query = supabase
        .from(table)
        .select(columns) as PostgrestFilterBuilder<any, any, T[]>;
      
      if (filters) {
        query = filters(query);
      }
      
      return await query;
    });
  },

  // Méthode pour insérer des données avec retry
  insert: async <T>(
    table: string, 
    values: Partial<T> | Partial<T>[]
  ): SupabaseResponse<T> => {
    return await supabaseApi.executeWithRetry(async () => {
      const query = supabase
        .from(table)
        .insert(values)
        .select()
        .single() as PostgrestFilterBuilder<any, any, T>;
      
      return await query;
    });
  },

  // Méthode pour mettre à jour des données avec retry
  update: async <T>(
    table: string, 
    values: Partial<T>,
    filters: (query: PostgrestFilterBuilder<any, any, T>) => PostgrestFilterBuilder<any, any, T>
  ): SupabaseResponse<T> => {
    return await supabaseApi.executeWithRetry(async () => {
      let query = supabase
        .from(table)
        .update(values) as PostgrestFilterBuilder<any, any, T>;
      
      query = filters(query);
      return await query.select().single();
    });
  },

  // Méthode pour supprimer des données avec retry
  delete: async <T>(
    table: string,
    filters: (query: PostgrestFilterBuilder<any, any, T>) => PostgrestFilterBuilder<any, any, T>
  ): SupabaseResponse<T> => {
    return await supabaseApi.executeWithRetry(async () => {
      let query = supabase
        .from(table)
        .delete() as PostgrestFilterBuilder<any, any, T>;
      
      query = filters(query);
      return await query.select().single();
    });
  }
};
