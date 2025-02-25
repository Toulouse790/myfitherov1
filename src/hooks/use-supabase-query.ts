
import { useState, useEffect } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { appCache } from '@/utils/cache';

interface QueryOptions<T> {
  table: string;
  columns?: string;
  filters?: Partial<Record<keyof T, any>>;
  order?: { column: keyof T; ascending?: boolean };
  limit?: number;
  single?: boolean;
  cache?: boolean;
  cacheTtl?: number; // en secondes
}

/**
 * Hook personnalisé pour effectuer des requêtes Supabase avec gestion du cache
 * @template T - Type des données attendues
 * @param options - Options de configuration de la requête
 * @returns Object contenant les données, l'état de chargement et les erreurs
 */
export function useSupabaseQuery<T extends Record<string, any>>(options: QueryOptions<T>) {
  const [data, setData] = useState<T | T[] | null>(null);
  const [error, setError] = useState<PostgrestError | Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = options.cache 
        ? `query_${options.table}_${JSON.stringify(options)}` 
        : null;
      
      // Vérifier le cache si activé
      if (cacheKey) {
        const cachedData = appCache.get<T | T[]>(cacheKey);
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
      }

      try {
        let query = supabase
          .from(options.table)
          .select<string, T>(options.columns || '*');
        
        // Appliquer les filtres
        if (options.filters) {
          Object.entries(options.filters).forEach(([key, value]) => {
            if (value !== undefined) {
              query = query.eq(key, value);
            }
          });
        }
        
        // Appliquer l'ordre
        if (options.order) {
          query = query.order(String(options.order.column), { 
            ascending: options.order.ascending ?? true 
          });
        }
        
        // Appliquer la limite
        if (options.limit) {
          query = query.limit(options.limit);
        }
        
        // Exécuter la requête
        const { data: result, error: queryError } = options.single 
          ? await query.maybeSingle()
          : await query;
        
        if (queryError) throw queryError;
        
        setData(result as T | T[]);
        setError(null);
        
        // Mettre en cache si activé
        if (cacheKey && result) {
          appCache.set(cacheKey, result, options.cacheTtl || 300);
        }
      } catch (err) {
        console.error(`Erreur lors de la requête Supabase sur ${options.table}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [options.table, JSON.stringify(options)]);

  const refetch = () => {
    setLoading(true);
    const cacheKey = options.cache 
      ? `query_${options.table}_${JSON.stringify(options)}` 
      : null;
    if (cacheKey) appCache.delete(cacheKey);
    fetchData();
  };

  return { 
    data, 
    error, 
    loading,
    refetch,
    isError: error !== null,
    isEmpty: !loading && !data,
    isSuccess: !loading && !error && data !== null 
  };
}

