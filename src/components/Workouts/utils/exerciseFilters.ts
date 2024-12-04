export const filterExercisesByMuscleGroup = (exercises: any[], muscleId: string) => {
  return exercises.filter(ex => {
    if (muscleId === "fullBody") return true;
    if (muscleId === "biceps" || muscleId === "triceps") {
      return ex.muscleGroup === "arms";
    }
    if (muscleId === "quadriceps" || muscleId === "hamstrings" || muscleId === "glutes") {
      return ex.muscleGroup === "legs";
    }
    if (muscleId === "lower_back") {
      return ex.muscleGroup === "back";
    }
    if (muscleId === "chest") {
      return ex.muscleGroup === "chest";
    }
    return ex.muscleGroup === muscleId;
  });
};

export const checkExerciseMatch = (exercise: any, muscleId: string): boolean => {
  let matches = false;
  if (muscleId === "fullBody") {
    matches = true;
  } else if (muscleId === "biceps" || muscleId === "triceps") {
    matches = exercise.muscleGroup === "arms";
  } else if (muscleId === "quadriceps" || muscleId === "hamstrings" || muscleId === "glutes") {
    matches = exercise.muscleGroup === "legs";
  } else if (muscleId === "lower_back") {
    matches = exercise.muscleGroup === "back";
  } else if (muscleId === "chest") {
    matches = exercise.muscleGroup === "chest";
  } else {
    matches = exercise.muscleGroup === muscleId;
  }
  return matches;
};