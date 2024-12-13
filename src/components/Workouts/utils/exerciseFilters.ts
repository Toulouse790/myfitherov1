export const filterExercisesByMuscleGroup = (exercises: any[], muscleId: string) => {
  return exercises.filter(ex => {
    if (muscleId === "fullBody") return true;
    
    const muscleGroupMap: { [key: string]: string[] } = {
      pectoraux: ["pectoraux"],
      dos: ["dos"],
      jambes: ["jambes"],
      épaules: ["épaules"],
      biceps: ["biceps"],
      triceps: ["triceps"],
      abdominaux: ["abdominaux"]  // Standardisé sur "abdominaux"
    };

    const muscleGroup = ex.muscle_group.toLowerCase();
    console.log(`Filtering exercise with muscle group: ${muscleGroup} for muscleId: ${muscleId}`);
    return muscleGroupMap[muscleId]?.includes(muscleGroup);
  });
};

export const checkExerciseMatch = (exercise: any, muscleId: string): boolean => {
  const muscleGroupMap: { [key: string]: string[] } = {
    pectoraux: ["pectoraux"],
    dos: ["dos"],
    jambes: ["jambes"],
    épaules: ["épaules"],
    biceps: ["biceps"],
    triceps: ["triceps"],
    abdominaux: ["abdominaux"]  // Standardisé sur "abdominaux"
  };

  const muscleGroup = exercise.muscle_group.toLowerCase();
  console.log(`Checking exercise match: ${muscleGroup} with muscleId: ${muscleId}`);
  return muscleId === "fullBody" || muscleGroupMap[muscleId]?.includes(muscleGroup);
};