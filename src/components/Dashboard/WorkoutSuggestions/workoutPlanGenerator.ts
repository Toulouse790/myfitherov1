
import { supabase } from "@/integrations/supabase/client";
import { muscleRecoveryData } from "@/utils/workoutPlanning";

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

// Fonction pour calculer un score d'exercice basé sur les données utilisateur
const calculateExerciseScore = async (
  exerciseName: string,
  userProfile: UserProfile,
  muscleRecoveryStatus: { muscleGroup: string; recoveryStatus: string }[]
) => {
  let score = 100;

  // 1. Vérifier le niveau de difficulté par rapport à l'expérience
  const { data: exerciseData } = await supabase
    .from('unified_exercises')
    .select('difficulty, muscle_group, location, equipment_needed')
    .eq('name', exerciseName)
    .single();

  if (exerciseData) {
    // Ajuster le score en fonction du niveau de difficulté
    if (userProfile.experienceLevel === 'beginner' && exerciseData.difficulty?.includes('advanced')) {
      score -= 40;
    }
    if (userProfile.experienceLevel === 'advanced' && exerciseData.difficulty?.includes('beginner')) {
      score -= 20;
    }

    // Vérifier si l'équipement nécessaire est disponible
    const equipmentNeeded = exerciseData.equipment_needed || exerciseData.location;
    if (equipmentNeeded && userProfile.availableEquipment && 
        !equipmentNeeded.includes(userProfile.availableEquipment)) {
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

    // Bonus pour les exercices composés si l'objectif est de gagner du muscle
    const compoundExercises = [
      'squat', 'deadlift', 'bench press', 'overhead press', 'row', 'pull-up'
    ];
    
    if (userProfile.goal === 'muscle_gain' && 
        compoundExercises.some(exercise => exerciseName.toLowerCase().includes(exercise))) {
      score += 30;
    }
    
    // Bonus pour les exercices à haute dépense calorique si l'objectif est la perte de poids
    if (userProfile.goal === 'weight_loss' && 
        (exerciseData.muscle_group === 'legs' || exerciseName.toLowerCase().includes('cardio'))) {
      score += 25;
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

  // Récupérer les infos des exercices pour diversifier les groupes musculaires
  const exerciseInfoPromises = viableExercises.map(async (exercise) => {
    const { data } = await supabase
      .from('unified_exercises')
      .select('muscle_group')
      .eq('name', exercise.name)
      .single();
    
    return {
      name: exercise.name,
      score: exercise.score,
      muscleGroup: data?.muscle_group || 'unknown'
    };
  });

  const exercisesWithInfo = await Promise.all(exerciseInfoPromises);
  
  // Garantir au moins un exercice pour les grands groupes musculaires
  const majorMuscleGroups = ['chest', 'back', 'legs', 'shoulders'];
  
  // D'abord, essayer d'inclure un exercice pour chaque groupe musculaire majeur
  for (const muscleGroup of majorMuscleGroups) {
    if (selectedExercises.length >= 6) break; // Maximum 6 exercices par séance
    
    const bestExerciseForMuscle = exercisesWithInfo
      .filter(ex => ex.muscleGroup === muscleGroup)
      .sort((a, b) => b.score - a.score)[0];
    
    if (bestExerciseForMuscle && !usedMuscleGroups.has(muscleGroup)) {
      usedMuscleGroups.add(muscleGroup);
      
      // Adapter les séries et répétitions selon l'objectif et le niveau
      const sets = profile.experienceLevel === 'beginner' ? 3 : 
                  profile.experienceLevel === 'advanced' ? 5 : 4;
      
      const reps = profile.goal === 'muscle_gain' ? 
                  (profile.experienceLevel === 'advanced' ? 6 : 8) : 
                  profile.goal === 'weight_loss' ? 15 : 10;
      
      const restTime = profile.experienceLevel === 'beginner' ? 90 : 
                      profile.goal === 'muscle_gain' ? 120 : 60;

      selectedExercises.push({
        name: bestExerciseForMuscle.name,
        sets,
        reps,
        restTime
      });
    }
  }

  // Compléter avec d'autres exercices pour atteindre 4-6 exercices
  for (const exercise of exercisesWithInfo) {
    if (selectedExercises.length >= 6) break; // Maximum 6 exercices par séance
    
    if (!usedMuscleGroups.has(exercise.muscleGroup)) {
      usedMuscleGroups.add(exercise.muscleGroup);
      
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
  }

  // Si nous n'avons pas assez d'exercices, ajouter les meilleurs même s'ils ciblent des groupes déjà utilisés
  if (selectedExercises.length < 4) {
    for (const exercise of exercisesWithInfo) {
      if (selectedExercises.some(e => e.name === exercise.name)) continue;
      if (selectedExercises.length >= 4) break;
      
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
  }

  // Calculer l'intensité et le volume en fonction du profil
  const intensity = profile.experienceLevel === 'beginner' ? 0.7 : 
                   profile.experienceLevel === 'advanced' ? 0.9 : 0.8;

  let volume = profile.goal === 'muscle_gain' ? 16 : 12;
  
  // Ajuster le volume en fonction de la capacité de récupération
  if (profile.recoveryCapacity === 'low') {
    volume = Math.max(8, volume - 4);
  } else if (profile.recoveryCapacity === 'high') {
    volume = Math.min(24, volume + 4);
  }

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
