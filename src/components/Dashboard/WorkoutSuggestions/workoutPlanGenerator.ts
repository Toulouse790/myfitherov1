import { supabase } from "@/integrations/supabase/client";

export interface Exercise {
  name: string;
  sets: number;
  reps: number;
  restTime: number;
}

export interface WorkoutPlan {
  volume: number;
  intensity: number;
  recommendedRest: number;
  setsAndReps: {
    sets: number;
    reps: number;
  };
  exercises: Exercise[];
}

interface UserProfile {
  age: number;
  weight: number;
  height: number;
  goal: string;
  workoutsPerWeek: number;
  dailyCalories: number;
  recoveryCapacity: 'low' | 'medium' | 'high';
  experienceLevel?: string;
  availableEquipment?: string;
}

const calculateExerciseScore = async (
  exerciseName: string,
  userProfile: UserProfile,
  muscleRecoveryStatus: { muscleGroup: string; recoveryStatus: string }[]
) => {
  let score = 100;

  // 1. Vérifier le niveau de difficulté par rapport à l'expérience
  const { data: exerciseData } = await supabase
    .from('unified_exercises')
    .select('difficulty, muscle_group, location')
    .eq('name', exerciseName)
    .single();

  if (exerciseData) {
    // Ajuster le score en fonction du niveau de difficulté
    if (userProfile.experienceLevel === 'beginner' && exerciseData.difficulty.includes('advanced')) {
      score -= 40;
    }
    if (userProfile.experienceLevel === 'advanced' && exerciseData.difficulty.includes('beginner')) {
      score -= 20;
    }

    // Vérifier si l'équipement nécessaire est disponible
    if (exerciseData.location && !exerciseData.location.includes(userProfile.availableEquipment)) {
      score -= 100; // Exercice impossible sans équipement
    }

    // Vérifier l'état de récupération du groupe musculaire
    const muscleStatus = muscleRecoveryStatus.find(
      status => status.muscleGroup === exerciseData.muscle_group
    );
    if (muscleStatus) {
      switch (muscleStatus.recoveryStatus) {
        case 'fatigued':
          score -= 80;
          break;
        case 'recovering':
          score -= 40;
          break;
        case 'recovered':
          score += 10;
          break;
      }
    }
  }

  return score;
};

export const generateWorkoutPlan = async (
  availableExercises: string[], 
  profile: UserProfile,
  muscleRecoveryStatus?: { muscleGroup: string; recoveryStatus: string }[]
): Promise<WorkoutPlan> => {
  console.log("Génération avec", availableExercises.length, "exercices disponibles");
  
  // Calculer les scores pour chaque exercice
  const exerciseScores = await Promise.all(
    availableExercises.map(async (exercise) => ({
      name: exercise,
      score: await calculateExerciseScore(exercise, profile, muscleRecoveryStatus || [])
    }))
  );

  // Trier les exercices par score et filtrer ceux qui sont impossibles (score <= 0)
  const viableExercises = exerciseScores
    .filter(ex => ex.score > 0)
    .sort((a, b) => b.score - a.score);

  // Sélectionner les meilleurs exercices en respectant la variété des groupes musculaires
  const selectedExercises: Exercise[] = [];
  const usedMuscleGroups = new Set<string>();

  for (const exercise of viableExercises) {
    const { data: exerciseData } = await supabase
      .from('unified_exercises')
      .select('muscle_group')
      .eq('name', exercise.name)
      .single();

    if (exerciseData && !usedMuscleGroups.has(exerciseData.muscle_group)) {
      usedMuscleGroups.add(exerciseData.muscle_group);
      
      // Adapter les séries et répétitions selon l'objectif et le niveau
      const sets = profile.experienceLevel === 'beginner' ? 3 : 4;
      const reps = profile.goal === 'muscle_gain' ? 8 : 12;
      const restTime = profile.experienceLevel === 'beginner' ? 90 : 60;

      selectedExercises.push({
        name: exercise.name,
        sets,
        reps,
        restTime
      });
    }

    if (selectedExercises.length >= 4) break; // Limiter à 4 exercices maximum
  }

  // Calculer l'intensité et le volume en fonction du profil
  const intensity = profile.experienceLevel === 'beginner' ? 0.7 : 
                   profile.experienceLevel === 'advanced' ? 0.9 : 0.8;

  const volume = profile.goal === 'muscle_gain' ? 16 : 12;

  return {
    volume,
    intensity,
    recommendedRest: profile.experienceLevel === 'beginner' ? 90 : 60,
    setsAndReps: {
      sets: profile.experienceLevel === 'beginner' ? 3 : 4,
      reps: profile.goal === 'muscle_gain' ? 8 : 12
    },
    exercises: selectedExercises
  };
};