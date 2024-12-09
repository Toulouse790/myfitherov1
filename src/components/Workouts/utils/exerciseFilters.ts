export const filterExercisesByMuscleGroup = (exercises: any[], muscleId: string) => {
  return exercises.filter(ex => {
    if (muscleId === "fullBody") return true;
    
    // Mapping simplifié des groupes musculaires
    const muscleGroupMap: { [key: string]: string[] } = {
      biceps: ["biceps"],
      triceps: ["triceps"],
      legs: ["jambes"],
      back: ["dos"],
      chest: ["pectoraux"],
      shoulders: ["épaules"],
      abs: ["abdominaux"]
    };

    const muscleGroup = ex.muscle_group.toLowerCase();
    return muscleGroupMap[muscleId]?.includes(muscleGroup);
  });
};

export const checkExerciseMatch = (exercise: any, muscleId: string): boolean => {
  const muscleGroupMap: { [key: string]: string[] } = {
    biceps: ["biceps"],
    triceps: ["triceps"],
    legs: ["jambes"],
    back: ["dos"],
    chest: ["pectoraux"],
    shoulders: ["épaules"],
    abs: ["abdominaux"]
  };

  const muscleGroup = exercise.muscle_group.toLowerCase();
  return muscleId === "fullBody" || muscleGroupMap[muscleId]?.includes(muscleGroup);
};