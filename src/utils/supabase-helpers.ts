
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

// Fonction pour exécuter le rapport de détection des doublons
export async function checkDuplicates(
  tableNames?: string[]
): Promise<
  | {
      table_name: string;
      column_checked: string[];
      duplicate_count: number;
      sample_values: Record<string, any> | null;
    }[]
  | null
> {
  try {
    let query = supabase.from('duplicate_records_report').select('*');

    if (tableNames && tableNames.length > 0) {
      query = query.in('table_name', tableNames);
    }

    // Trier les résultats pour que les tables avec des doublons apparaissent en premier
    query = query.order('duplicate_count', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Erreur lors de la vérification des doublons:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erreur lors de la vérification des doublons:', error);
    return null;
  }
}

// Fonction pour nettoyer les doublons dans une table spécifique
export async function cleanupDuplicates(
  tableName: string,
  columnNames: string[]
): Promise<{ success: boolean; message: string; deletedCount?: number }> {
  try {
    // Cette fonction doit être utilisée avec précaution
    // Idéalement, elle devrait être exécutée côté serveur avec une fonction RPC
    
    // Pour l'instant, retournons juste un message d'avertissement
    return {
      success: false,
      message: 'La suppression automatique des doublons doit être effectuée via une fonction sécurisée côté serveur. Veuillez contacter l\'administrateur.'
    };
  } catch (error) {
    console.error('Erreur lors du nettoyage des doublons:', error);
    return {
      success: false,
      message: `Erreur: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
