export const normalizeMuscleGroup = (group: string): string => {
  if (!group) return '';
  
  // Convert to lowercase, remove accents, and replace special characters with underscores
  const normalized = group
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '_') // Replace special chars with underscore
    .replace(/^_+|_+$/g, '') // Remove leading/trailing underscores
    .replace(/_+/g, '_'); // Replace multiple underscores with single

  return normalized;
};