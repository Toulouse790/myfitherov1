
import { supabase } from "@/integrations/supabase/client";

/**
 * Supprime un fichier spécifique d'un bucket de stockage Supabase
 * @param fileName Nom du fichier à supprimer
 * @param bucketName Nom du bucket contenant le fichier (par défaut 'exercise-media')
 * @returns Un objet indiquant le succès ou l'échec de l'opération
 */
export const deleteFileFromStorage = async (
  fileName: string,
  bucketName: string = 'exercise-media'
): Promise<{ success: boolean; message: string }> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([fileName]);

    if (error) {
      console.error('Erreur lors de la suppression du fichier:', error);
      return {
        success: false,
        message: `Erreur: ${error.message}`
      };
    }

    return {
      success: true,
      message: `Le fichier ${fileName} a été supprimé avec succès`
    };
  } catch (error) {
    console.error('Erreur inattendue:', error);
    return {
      success: false,
      message: `Une erreur inattendue s'est produite: ${error instanceof Error ? error.message : String(error)}`
    };
  }
};

/**
 * Exemple d'utilisation pour supprimer le fichier spécifique
 */
export const removeSpecificFile = async (): Promise<{ success: boolean; message: string }> => {
  return await deleteFileFromStorage('09ce8973-60de-4f3f-9825-a7e506fd2814.png');
};
