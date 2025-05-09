import { supabase } from "@/integrations/supabase/client";

interface UserProfile {
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  objectives: string[];
  availableEquipment: string[];
  age: number;
  gender: string;
  medicalConstraints?: string[];
}

interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sets: number;
  reps: number;
  videoUrl?: string;
  technique: string;
}

interface TrainingPlan {
  duration: number;
  frequency: number;
  progressionStrategy: string;
}

interface ExerciseRecommendation {
  muscleGroups: string[];
  exercises: Exercise[];
  trainingPlan: TrainingPlan;
}

async function getExercisesForMuscleGroup(
  muscleGroup: string, 
  profile: UserProfile,
  muscleRecoveryStatus?: { muscleGroup: string; recoveryStatus: string }[]
): Promise<Exercise[]> {
  const isRecovering = muscleRecoveryStatus?.some(
    status => status.muscleGroup === muscleGroup && 
    ['needs_rest', 'recovering'].includes(status.recoveryStatus)
  );

  if (isRecovering) {
    console.log(`Skipping ${muscleGroup} as it needs recovery`);
    return [];
  }

  const { data: exercises, error } = await supabase
    .from('unified_exercises')
    .select('*')
    .eq('muscle_group', muscleGroup)
    .in('difficulty', getDifficultyLevels(profile.fitnessLevel))
    .in('location', profile.availableEquipment)
    .eq('est_publié', true);

  if (error) {
    console.error('Error fetching exercises:', error);
    return [];
  }

  return exercises.map(exercise => ({
    id: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscle_group,
    difficulty: mapDifficultyLevel(exercise.difficulty[0]),
    sets: getRecommendedSets(profile.fitnessLevel),
    reps: getRecommendedReps(profile.fitnessLevel),
    videoUrl: exercise.video_url || undefined,
    technique: exercise.biomechanics?.technique || ''
  }));
}

function determineAdvancedGroups(profile: UserProfile): string[] {
  const baseGroups = ['pectoraux', 'dos', 'jambes', 'épaules', 'biceps', 'triceps'];
  // Filtrer en fonction des objectifs et contraintes médicales
  return baseGroups.filter(group => 
    !profile.medicalConstraints?.some(constraint => 
      isGroupAffectedByConstraint(group, constraint)
    )
  );
}

function getDifficultyLevels(fitnessLevel: string): string[] {
  switch (fitnessLevel) {
    case 'beginner':
      return ['beginner'];
    case 'intermediate':
      return ['beginner', 'intermediate'];
    case 'advanced':
      return ['intermediate', 'advanced'];
    default:
      return ['beginner'];
  }
}

function mapDifficultyLevel(level: string): 'easy' | 'medium' | 'hard' {
  switch (level) {
    case 'beginner':
      return 'easy';
    case 'intermediate':
      return 'medium';
    case 'advanced':
      return 'hard';
    default:
      return 'medium';
  }
}

function getRecommendedSets(fitnessLevel: string): number {
  switch (fitnessLevel) {
    case 'beginner':
      return 3;
    case 'intermediate':
      return 4;
    case 'advanced':
      return 5;
    default:
      return 3;
  }
}

function getRecommendedReps(fitnessLevel: string): number {
  switch (fitnessLevel) {
    case 'beginner':
      return 12;
    case 'intermediate':
      return 10;
    case 'advanced':
      return 8;
    default:
      return 12;
  }
}

function isGroupAffectedByConstraint(muscleGroup: string, constraint: string): boolean {
  // Mapping simplifié des contraintes médicales aux groupes musculaires
  const constraintMapping: Record<string, string[]> = {
    'shoulder_injury': ['épaules', 'pectoraux'],
    'knee_pain': ['jambes'],
    'back_pain': ['dos'],
    // Ajouter d'autres mappings selon les besoins
  };

  return constraintMapping[constraint]?.includes(muscleGroup) || false;
}

function constructTrainingPlan(profile: UserProfile): TrainingPlan {
  return {
    duration: 4, // 4 semaines par défaut
    frequency: getRecommendedFrequency(profile.fitnessLevel),
    progressionStrategy: getProgressionStrategy(profile)
  };
}

function getRecommendedFrequency(fitnessLevel: string): number {
  switch (fitnessLevel) {
    case 'beginner':
      return 3;
    case 'intermediate':
      return 4;
    case 'advanced':
      return 5;
    default:
      return 3;
  }
}

function getProgressionStrategy(profile: UserProfile): string {
  if (profile.fitnessLevel === 'beginner') {
    return 'linear';
  } else if (profile.fitnessLevel === 'intermediate') {
    return 'undulating';
  } else {
    return 'block';
  }
}

async function getMuscleRecoveryStatus(userId: string): Promise<{ muscleGroup: string; recoveryStatus: string }[]> {
  const { data, error } = await supabase
    .from('muscle_recovery')
    .select('muscle_group, recovery_status')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching muscle recovery status:', error);
    return [];
  }

  return data.map(item => ({
    muscleGroup: item.muscle_group,
    recoveryStatus: item.recovery_status
  }));
}

export async function generatePersonalizedTrainingPlan(profile: UserProfile): Promise<ExerciseRecommendation> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("User not authenticated");

  const muscleRecoveryStatus = await getMuscleRecoveryStatus(user.id);
  
  const muscleGroups = selectRelevantMuscleGroups(profile);
  
  const exercises = await Promise.all(
    muscleGroups.map(group => getExercisesForMuscleGroup(group, profile, muscleRecoveryStatus))
  ).then(exerciseArrays => exerciseArrays.flat().slice(0, 6)); // Limite à 6 exercices
  
  const trainingPlan = constructTrainingPlan(profile);

  try {
    const { error } = await supabase
      .from('exercise_recommendations')
      .insert({
        user_id: user.id,
        muscle_groups: muscleGroups,
        difficulty: profile.fitnessLevel === 'beginner' ? 'easy' : 
                   profile.fitnessLevel === 'intermediate' ? 'medium' : 'hard',
        exercises: exercises,
        training_plan: trainingPlan
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error saving recommendations:', error);
  }

  return {
    muscleGroups,
    exercises,
    trainingPlan
  };
}

function selectRelevantMuscleGroups(profile: UserProfile): string[] {
  const priorityGroups = {
    'beginner': ['full-body'],
    'intermediate': ['jambes', 'dos', 'pectoraux'],
    'advanced': determineAdvancedGroups(profile)
  };

  return priorityGroups[profile.fitnessLevel] || ['full-body'];
}

export type { UserProfile, Exercise, TrainingPlan, ExerciseRecommendation };
