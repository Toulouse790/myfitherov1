
import { PostgrestError } from '@supabase/postgrest-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Fonction utilitaire pour rafraîchir la session
 * @returns true si le rafraîchissement a réussi, false sinon
 */
export const refreshSupabaseSession = async () => {
  try {
    console.log("Rafraîchissement de la session Supabase...");
    const { data, error } = await supabase.auth.refreshSession();
    
    if (error) {
      console.error("Échec du rafraîchissement de la session:", error);
      return false;
    }
    
    console.log("Session rafraîchie avec succès");
    return true;
  } catch (error) {
    console.error("Erreur lors du rafraîchissement de la session:", error);
    return false;
  }
};

/**
 * Fonction générique pour exécuter des requêtes Supabase avec retry
 * @param operation Fonction de requête à exécuter
 * @returns Résultat de la requête avec données et/ou erreur
 */
export async function executeWithRetry<T>(
  operation: () => Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<{ data: T | null; error: PostgrestError | null }> {
  try {
    const { data, error } = await operation();
    
    // Si erreur d'authentification, rafraîchir la session et réessayer
    if (error && (
      error.code === 'PGRST301' || 
      error.code === '401' ||
      error.message?.includes('JWT') || 
      error.message?.includes('auth')
    )) {
      console.warn("Erreur d'authentification détectée, tentative de rafraîchissement");
      const refreshed = await refreshSupabaseSession();
      
      if (refreshed) {
        console.info("Réessai de l'opération après rafraîchissement");
        return await operation();
      }
    }
    
    return { data, error };
  } catch (e) {
    console.error("Erreur inattendue lors de l'exécution de la requête:", e);
    return { 
      data: null, 
      error: e instanceof PostgrestError ? e : new PostgrestError('Erreur inconnue', '500') 
    };
  }
}

/**
 * API simplifiée pour accéder à la base de données avec retry automatique
 */
export const db = {
  /**
   * Sélectionner des données
   * @param table Nom de la table
   * @param query Requête de sélection (colonnes)
   */
  select: async <T>(
    table: string, 
    query?: string
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
    return executeWithRetry(async () => {
      const result = await supabase
        .from(table)
        .select(query || '*');
      return result;
    });
  },
  
  /**
   * Récupérer un enregistrement unique par ID
   * @param table Nom de la table
   * @param id Identifiant de l'enregistrement
   * @param query Requête de sélection (colonnes)
   */
  getById: async <T>(
    table: string, 
    id: string, 
    query?: string
  ): Promise<{ data: T | null; error: PostgrestError | null }> => {
    return executeWithRetry(async () => {
      const result = await supabase
        .from(table)
        .select(query || '*')
        .eq('id', id)
        .single();
      return result;
    });
  },
  
  /**
   * Récupérer des enregistrements avec filtre personnalisé
   * @param table Nom de la table
   * @param column Colonne sur laquelle filtrer
   * @param value Valeur du filtre
   * @param query Requête de sélection (colonnes)
   */
  getFiltered: async <T>(
    table: string, 
    column: string, 
    value: any, 
    query?: string
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
    return executeWithRetry(async () => {
      const result = await supabase
        .from(table)
        .select(query || '*')
        .eq(column, value);
      return result;
    });
  },
  
  /**
   * Insérer des données
   * @param table Nom de la table
   * @param data Données à insérer
   */
  insert: async <T>(
    table: string, 
    data: Partial<T> | Partial<T>[]
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
    return executeWithRetry(async () => {
      const result = await supabase
        .from(table)
        .insert(data)
        .select();
      return result;
    });
  },
  
  /**
   * Mettre à jour des données
   * @param table Nom de la table
   * @param data Données à mettre à jour
   * @param column Colonne pour la condition de mise à jour
   * @param value Valeur pour la condition de mise à jour
   */
  update: async <T>(
    table: string, 
    data: Partial<T>, 
    column: string, 
    value: any
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
    return executeWithRetry(async () => {
      const result = await supabase
        .from(table)
        .update(data)
        .eq(column, value)
        .select();
      return result;
    });
  },
  
  /**
   * Supprimer des données
   * @param table Nom de la table
   * @param column Colonne pour la condition de suppression
   * @param value Valeur pour la condition de suppression
   */
  delete: async <T>(
    table: string, 
    column: string, 
    value: any
  ): Promise<{ data: T[] | null; error: PostgrestError | null }> => {
    return executeWithRetry(async () => {
      const result = await supabase
        .from(table)
        .delete()
        .eq(column, value)
        .select();
      return result;
    });
  }
};
