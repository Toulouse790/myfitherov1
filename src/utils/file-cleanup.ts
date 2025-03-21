
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
 * Supprime plusieurs fichiers d'un bucket de stockage Supabase
 * @param fileNames Tableau des noms de fichiers à supprimer
 * @param bucketName Nom du bucket contenant les fichiers (par défaut 'exercise-media')
 * @returns Un objet contenant les résultats de chaque suppression
 */
export const deleteMultipleFilesFromStorage = async (
  fileNames: string[],
  bucketName: string = 'exercise-media'
): Promise<{ success: boolean; results: Array<{ fileName: string; success: boolean; message: string }> }> => {
  const results = [];
  let allSuccessful = true;

  for (const fileName of fileNames) {
    const result = await deleteFileFromStorage(fileName, bucketName);
    results.push({
      fileName,
      success: result.success,
      message: result.message
    });

    if (!result.success) {
      allSuccessful = false;
    }
  }

  return {
    success: allSuccessful,
    results
  };
};

/**
 * Supprime les fichiers spécifiés du bucket d'exercices
 */
export const removeSpecificFiles = async (): Promise<{ success: boolean; results: Array<{ fileName: string; success: boolean; message: string }> }> => {
  const filesToRemove = [
    '09ce8973-60de-4f3f-9825-a7e506fd2814.png',
    '5cefaf8e-f3fb-4c8c-95ab-650179ce7655.png',
    '86a01e96-7001-446f-a664-90f1a5414d5b.png',
    'd11ce5d6-3770-4313-bef4-0c19f1a205f7.png',
    'e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png'
  ];
  
  return await deleteMultipleFilesFromStorage(filesToRemove);
};
