/**
 * Normalise un nom d'exercice pour l'utiliser dans les URLs
 * Exemple: "Écarté avec haltères" -> "ecarte_avec_halteres"
 */
export const normalizeExerciseName = (name: string): string => {
  if (!name) return '';
  
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Enlève les accents
    .replace(/[^a-z0-9]+/g, '_')     // Remplace les caractères spéciaux par _
    .replace(/^_+|_+$/g, '');        // Enlève les _ au début et à la fin
};

/**
 * Vérifie si un nom d'exercice est valide
 */
export const isValidExerciseName = (name: unknown): name is string => {
  return typeof name === 'string' && name.trim().length > 0;
};