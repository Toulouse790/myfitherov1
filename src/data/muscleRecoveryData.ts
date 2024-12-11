interface MuscleGroup {
  name: string;
  recoveryTime: number; // in hours
  synergistMuscles: string[]; // muscles that work together
}

export const muscleRecoveryData: { [key: string]: MuscleGroup } = {
  chest: {
    name: "Pectoraux",
    recoveryTime: 48,
    synergistMuscles: ["shoulders", "triceps"]
  },
  back: {
    name: "Dos",
    recoveryTime: 72,
    synergistMuscles: ["biceps", "shoulders"]
  },
  legs: {
    name: "Jambes",
    recoveryTime: 72,
    synergistMuscles: ["lower_back"]
  },
  shoulders: {
    name: "Épaules",
    recoveryTime: 48,
    synergistMuscles: ["triceps", "chest"]
  },
  biceps: {
    name: "Biceps",
    recoveryTime: 48,
    synergistMuscles: ["back"]
  },
  triceps: {
    name: "Triceps",
    recoveryTime: 48,
    synergistMuscles: ["chest", "shoulders"]
  },
  abs: {
    name: "Abdominaux",
    recoveryTime: 24,
    synergistMuscles: ["lower_back"]
  }
};