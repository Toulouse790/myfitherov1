export const muscleGroups = [
  { id: 'pectoraux', name: 'Pectoraux' },
  { id: 'dos', name: 'Dos' },
  { id: 'jambes', name: 'Jambes' },
  { id: 'épaules', name: 'Épaules' },
  { id: 'biceps', name: 'Biceps' },
  { id: 'triceps', name: 'Triceps' },
  { id: 'abdominaux', name: 'Abdominaux' }
];

export const difficultyLevels = [
  { id: 'débutant', name: 'Débutant' },
  { id: 'intermédiaire', name: 'Intermédiaire' },
  { id: 'avancé', name: 'Avancé' }
];

export const locations = [
  { id: 'maison', name: 'Maison' },
  { id: 'salle', name: 'Salle' },
  { id: 'extérieur', name: 'Extérieur' }
];

export interface WorkoutFormData {
  title: string;
  muscleGroups: string[];
  difficulty: string;
  duration: string;
  exercises: string;
}