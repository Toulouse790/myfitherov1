
export const filterExercisesByMuscleGroup = (exercises: any[], muscleId: string) => {
  if (!Array.isArray(exercises) || exercises.length === 0) {
    console.warn("Aucun exercice à filtrer ou format incorrect");
    return [];
  }

  // Pour fullBody, on retourne tous les exercices
  if (muscleId === "fullBody") {
    return exercises;
  }
  
  const muscleGroupMap: { [key: string]: string[] } = {
    pectoraux: ["pectoraux"],
    dos: ["dos"],
    jambes: ["jambes"],
    épaules: ["épaules"],
    biceps: ["biceps"],
    triceps: ["triceps"],
    abdominaux: ["abdominaux"]
  };

  // Vérifier que l'exercice correspond au groupe musculaire sélectionné
  return exercises.filter(ex => {
    // Si l'exercice est une chaîne de caractères, on ne peut pas filtrer
    if (typeof ex === 'string') {
      return true;
    }
    
    // Vérifier si l'exercice contient le champ muscle_group
    const muscleGroup = ex.muscle_group?.toLowerCase();
    
    if (!muscleGroup) {
      return false;
    }
    
    console.log(`Filtrage d'exercice avec groupe musculaire: ${muscleGroup} pour muscleId: ${muscleId}`);
    
    // Vérifier si le groupe musculaire est dans la liste des groupes musculaires correspondant à muscleId
    return muscleGroupMap[muscleId]?.some(group => muscleGroup.includes(group));
  });
};

export const checkExerciseMatch = (exercise: any, muscleId: string): boolean => {
  if (!exercise || typeof exercise !== 'object') {
    return false;
  }

  // Pour fullBody, on accepte tous les exercices
  if (muscleId === "fullBody") {
    return true;
  }

  const muscleGroupMap: { [key: string]: string[] } = {
    pectoraux: ["pectoraux"],
    dos: ["dos"],
    jambes: ["jambes"],
    épaules: ["épaules"],
    biceps: ["biceps"],
    triceps: ["triceps"],
    abdominaux: ["abdominaux"]
  };

  const muscleGroup = exercise.muscle_group?.toLowerCase();
  
  if (!muscleGroup) {
    return false;
  }
  
  console.log(`Vérification correspondance exercice: ${muscleGroup} avec muscleId: ${muscleId}`);
  
  return muscleGroupMap[muscleId]?.some(group => muscleGroup.includes(group));
};
