export const muscleGroups = [
  { id: 'pectoraux', name: 'Pectoraux', color: 'bg-red-500' },
  { id: 'dos', name: 'Dos', color: 'bg-blue-500' },
  { id: 'jambes', name: 'Jambes', color: 'bg-green-500' },
  { id: 'épaules', name: 'Épaules', color: 'bg-yellow-500' },
  { id: 'biceps', name: 'Biceps', color: 'bg-purple-500' },
  { id: 'triceps', name: 'Triceps', color: 'bg-pink-500' },
  { id: 'abdominaux', name: 'Abdominaux', color: 'bg-orange-500' }
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

export const initialFormData: WorkoutFormData = {
  title: "",
  muscleGroups: [],
  difficulty: "",
  duration: "",
  exercises: ""
};