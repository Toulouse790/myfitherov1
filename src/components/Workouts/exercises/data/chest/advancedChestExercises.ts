import { Exercise } from '../../types/exercise';

export const advancedChestExercises: Exercise[] = [
  {
    id: "chest-3",
    name: "Dips",
    muscle_group: "chest",
    muscleGroup: "chest",
    description: "Advanced bodyweight chest exercise",
    difficulty: ["advanced"],
    equipment: "Parallel bars",
    location: ["gym"],
    instructions: [
      "Support yourself on parallel bars",
      "Lower your body by bending your elbows",
      "Push back up to starting position",
      "Keep chest leaning forward"
    ],
    targetMuscles: ["chest", "triceps", "shoulders"],
    objectives: ["muscle_gain", "endurance"],
    sets: {
      beginner: 2,
      intermediate: 3,
      advanced: 4
    },
    reps: {
      beginner: 6,
      intermediate: 10,
      advanced: 15
    },
    restTime: {
      beginner: 120,
      intermediate: 90,
      advanced: 60
    },
    calories: 120
  }
];