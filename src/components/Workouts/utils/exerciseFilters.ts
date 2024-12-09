export const filterExercisesByMuscleGroup = (exercises: any[], muscleId: string) => {
  return exercises.filter(ex => {
    if (muscleId === "fullBody") return true;
    
    // Mapping des groupes musculaires
    const muscleGroupMap: { [key: string]: string[] } = {
      biceps: ["biceps"],
      triceps: ["triceps"],
      legs: ["jambes", "legs"],
      back: ["dos", "back"],
      chest: ["pectoraux", "poitrine", "chest"],
      shoulders: ["épaules", "shoulders"],
      abs: ["abdominaux", "abs"]
    };

    const muscleGroup = ex.muscle_group.toLowerCase();
    return muscleGroupMap[muscleId]?.includes(muscleGroup);
  });
};

export const checkExerciseMatch = (exercise: any, muscleId: string): boolean => {
  const muscleGroupMap: { [key: string]: string[] } = {
    biceps: ["biceps"],
    triceps: ["triceps"],
    legs: ["jambes", "legs"],
    back: ["dos", "back"],
    chest: ["pectoraux", "poitrine", "chest"],
    shoulders: ["épaules", "shoulders"],
    abs: ["abdominaux", "abs"]
  };

  const muscleGroup = exercise.muscle_group.toLowerCase();
  return muscleId === "fullBody" || muscleGroupMap[muscleId]?.includes(muscleGroup);
};