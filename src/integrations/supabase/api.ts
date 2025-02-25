
import { supabase } from './client';
import { refreshSession } from './auth';
import type { PostgrestFilterBuilder, PostgrestBuilder } from '@supabase/postgrest-js';

type SupabaseQuery<T> = PostgrestBuilder<T, T> & {
  executeWithRetry?: () => Promise<{ data: T | null; error: Error | null }>;
};

// Wrapper pour les appels à l'API Supabase avec gestion automatique de l'authentification
export const supabaseApi = {
  from: <T>(table: string) => {
    const query = supabase.from(table);
    
    // Intercepter la méthode select
    const originalSelect = query.select;
    query.select = function<SelectResult = T>(selectQuery?: string): SupabaseQuery<SelectResult> {
      const builder = originalSelect.call(this, selectQuery);
      
      return {
        ...builder,
        executeWithRetry: async function() {
          try {
            const { data, error } = await builder;
            
            if (error && (
              error.code === 'PGRST301' || 
              error.code === '401' ||
              (typeof error.message === 'string' && error.message.includes('JWT'))
            )) {
              console.log('Session expirée, tentative de rafraîchissement...');
              // Problème d'authentification, essayer de rafraîchir la session
              await refreshSession();
              // Réessayer la requête
              return await supabase.from(table).select(selectQuery);
            }
            
            return { data, error };
          } catch (e) {
            console.error(`Erreur lors de l'exécution de la requête sur ${table}:`, e);
            return { 
              data: null, 
              error: e instanceof Error ? e : new Error('Erreur inconnue') 
            };
          }
        }
      };
    };

    // Intercepter la méthode insert
    const originalInsert = query.insert;
    query.insert = function<InsertResult = T>(values: Partial<T>): SupabaseQuery<InsertResult> {
      const builder = originalInsert.call(this, values);
      
      return {
        ...builder,
        executeWithRetry: async function() {
          try {
            const { data, error } = await builder;
            
            if (error && (error.code === '401' || error.message.includes('JWT'))) {
              console.log('Session expirée lors de l\'insertion, tentative de rafraîchissement...');
              await refreshSession();
              return await supabase.from(table).insert(values);
            }
            
            return { data, error };
          } catch (e) {
            console.error(`Erreur lors de l'insertion dans ${table}:`, e);
            return { 
              data: null, 
              error: e instanceof Error ? e : new Error('Erreur inconnue') 
            };
          }
        }
      };
    };

    // Intercepter la méthode update
    const originalUpdate = query.update;
    query.update = function<UpdateResult = T>(values: Partial<T>): SupabaseQuery<UpdateResult> {
      const builder = originalUpdate.call(this, values);
      
      return {
        ...builder,
        executeWithRetry: async function() {
          try {
            const { data, error } = await builder;
            
            if (error && (error.code === '401' || error.message.includes('JWT'))) {
              console.log('Session expirée lors de la mise à jour, tentative de rafraîchissement...');
              await refreshSession();
              return await supabase.from(table).update(values);
            }
            
            return { data, error };
          } catch (e) {
            console.error(`Erreur lors de la mise à jour de ${table}:`, e);
            return { 
              data: null, 
              error: e instanceof Error ? e : new Error('Erreur inconnue') 
            };
          }
        }
      };
    };

    // Intercepter la méthode delete
    const originalDelete = query.delete;
    query.delete = function<DeleteResult = T>(): SupabaseQuery<DeleteResult> {
      const builder = originalDelete.call(this);
      
      return {
        ...builder,
        executeWithRetry: async function() {
          try {
            const { data, error } = await builder;
            
            if (error && (error.code === '401' || error.message.includes('JWT'))) {
              console.log('Session expirée lors de la suppression, tentative de rafraîchissement...');
              await refreshSession();
              return await supabase.from(table).delete();
            }
            
            return { data, error };
          } catch (e) {
            console.error(`Erreur lors de la suppression dans ${table}:`, e);
            return { 
              data: null, 
              error: e instanceof Error ? e : new Error('Erreur inconnue') 
            };
          }
        }
      };
    };
    
    return query;
  }
};
