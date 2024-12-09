export const filterExercisesByMuscleGroup = (exercises: any[], muscleId: string) => {
  return exercises.filter(ex => {
    if (muscleId === "fullBody") return true;
    
    const muscleGroup = ex.muscle_group.toLowerCase();
    return muscleId === muscleGroup;
  });
};

export const checkExerciseMatch = (exercise: any, muscleId: string): boolean => {
  const muscleGroup = exercise.muscle_group.toLowerCase();
  return muscleId === "fullBody" || muscleId === muscleGroup;
};