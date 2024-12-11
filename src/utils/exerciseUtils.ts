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
    .replace(/^_+|_+$/g, '')         // Enlève les _ au début et à la fin
    .replace(/_+/g, '_');            // Remplace les multiples _ par un seul
};

/**
 * Vérifie si un nom d'exercice est valide
 */
export const isValidExerciseName = (name: unknown): name is string => {
  if (typeof name !== 'string') {
    console.warn('Invalid exercise name type:', typeof name);
    return false;
  }
  
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    console.warn('Empty exercise name detected');
    return false;
  }
  
  return true;
};

/**
 * Encode un nom d'exercice pour une URL
 */
export const encodeExerciseName = (name: string): string => {
  const normalized = normalizeExerciseName(name);
  return encodeURIComponent(normalized);
};