export const filterExercisesByMuscleGroup = (exercises: any[], muscleId: string) => {
  return exercises.filter(ex => {
    if (muscleId === "fullBody") return true;
    
    // Mapping des groupes musculaires
    const muscleGroupMap: { [key: string]: string[] } = {
      biceps: ["arms", "biceps"],
      triceps: ["arms", "triceps"],
      legs: ["legs", "quadriceps", "hamstrings", "glutes"],
      back: ["back", "lower_back"],
      chest: ["chest", "pectoraux", "poitrine"],
      shoulders: ["shoulders", "épaules"],
      abs: ["abs", "abdominaux"]
    };

    return muscleGroupMap[muscleId]?.includes(ex.muscle_group.toLowerCase()) || ex.muscle_group === muscleId;
  });
};

export const checkExerciseMatch = (exercise: any, muscleId: string): boolean => {
  const muscleGroupMap: { [key: string]: string[] } = {
    biceps: ["arms", "biceps"],
    triceps: ["arms", "triceps"],
    legs: ["legs", "quadriceps", "hamstrings", "glutes"],
    back: ["back", "lower_back"],
    chest: ["chest", "pectoraux", "poitrine"],
    shoulders: ["shoulders", "épaules"],
    abs: ["abs", "abdominaux"]
  };

  return muscleId === "fullBody" || 
         muscleGroupMap[muscleId]?.includes(exercise.muscle_group.toLowerCase()) || 
         exercise.muscle_group === muscleId;
};