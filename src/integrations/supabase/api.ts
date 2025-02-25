
import { supabase } from './client';
import { refreshSession } from './auth';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';
import type { PostgrestBuilder } from '@supabase/postgrest-js';

type SupabaseQuery = PostgrestBuilder<any, any, any> & {
  executeWithRetry?: () => Promise<{ data: any; error: any }>;
};

// Wrapper pour les appels à l'API Supabase avec gestion automatique de l'authentification
export const supabaseApi = {
  from: (table: string) => {
    const query = supabase.from(table);
    
    // Intercepter la méthode select
    const originalSelect = query.select;
    query.select = function(...args: any[]): SupabaseQuery {
      const builder = originalSelect.apply(this, args);
      
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
              return await supabase.from(table).select(...args);
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
    query.insert = function(...args: any[]): SupabaseQuery {
      const builder = originalInsert.apply(this, args);
      
      return {
        ...builder,
        executeWithRetry: async function() {
          try {
            const { data, error } = await builder;
            
            if (error && (error.code === '401' || error.message.includes('JWT'))) {
              console.log('Session expirée lors de l\'insertion, tentative de rafraîchissement...');
              await refreshSession();
              return await supabase.from(table).insert(...args);
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
    query.update = function(...args: any[]): SupabaseQuery {
      const builder = originalUpdate.apply(this, args);
      
      return {
        ...builder,
        executeWithRetry: async function() {
          try {
            const { data, error } = await builder;
            
            if (error && (error.code === '401' || error.message.includes('JWT'))) {
              console.log('Session expirée lors de la mise à jour, tentative de rafraîchissement...');
              await refreshSession();
              return await supabase.from(table).update(...args);
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
    query.delete = function(): SupabaseQuery {
      const builder = originalDelete.apply(this);
      
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
