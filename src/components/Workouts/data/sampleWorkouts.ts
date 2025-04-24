
export const sampleWorkouts = [
  {
    id: "1",
    title: "Full Body Débutant",
    muscleGroups: ["fullBody"],
    difficulty: "beginner", // Utilisera la traduction basée sur cette clé
    duration: 45,
    location: "gym",
    exercises: [
      {
        name: "Développé couché",
        sets: 3,
        reps: 12,
        calories: 40,
        image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
      },
      {
        name: "Squat",
        sets: 3,
        reps: 12,
        calories: 60,
        image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
      },
      {
        name: "Rowing barre",
        sets: 3,
        reps: 12,
        calories: 35,
        image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
      }
    ],
    lastPerformed: "2024-03-15",
    completedCount: 5,
    totalCalories: 405
  },
  {
    id: "2",
    title: "Push Day Intermédiaire",
    muscleGroups: ["chest", "shoulders", "triceps"],
    difficulty: "intermediate", // Utilisera la traduction basée sur cette clé
    duration: 60,
    location: "gym",
    exercises: [
      {
        name: "Développé militaire",
        sets: 4,
        reps: 10,
        calories: 45,
        image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
      },
      {
        name: "Développé incliné haltères",
        sets: 3,
        reps: 12,
        calories: 40,
        image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
      },
      {
        name: "Dips",
        sets: 3,
        reps: 15,
        calories: 35,
        image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png"
      }
    ],
    lastPerformed: "2024-03-12",
    completedCount: 8,
    totalCalories: 480
  }
];
