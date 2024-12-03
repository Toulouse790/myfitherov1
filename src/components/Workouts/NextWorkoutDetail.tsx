import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Dumbbell, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MetricComparison } from "./NextWorkoutDetail/MetricComparison";
import { ExerciseCard } from "./NextWorkoutDetail/ExerciseCard";
import { WorkoutHeader } from "./NextWorkoutDetail/WorkoutHeader";
import { getNextWorkoutRecommendation } from "@/utils/workoutPlanning";

const SAMPLE_EXERCISES = [
  {
    name: "Rowing avec Haltères",
    sets: 3,
    reps: "12-15",
    rest: 60,
    image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
    planned: {
      duration: 15,
      calories: 100
    },
    actual: {
      duration: 17,
      calories: 120
    }
  },
  {
    name: "Tirage à la poulie barre en V",
    sets: 4,
    reps: "10-12",
    rest: 90,
    image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
    planned: {
      duration: 20,
      calories: 150
    },
    actual: {
      duration: 18,
      calories: 145
    }
  },
  {
    name: "Curl Biceps aux Haltères",
    sets: 3,
    reps: "12",
    rest: 60,
    image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
    planned: {
      duration: 12,
      calories: 80
    },
    actual: {
      duration: 14,
      calories: 90
    }
  },
  {
    name: "Développé Militaire",
    sets: 4,
    reps: "8-10",
    rest: 90,
    image: "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
    planned: {
      duration: 14,
      calories: 120
    },
    actual: {
      duration: 15,
      calories: 130
    }
  }
];

export const NextWorkoutDetail = () => {
  const { toast } = useToast();

  const totals = SAMPLE_EXERCISES.reduce((acc, exercise) => ({
    plannedDuration: acc.plannedDuration + exercise.planned.duration,
    actualDuration: acc.actualDuration + exercise.actual.duration,
    plannedCalories: acc.plannedCalories + exercise.planned.calories,
    actualCalories: acc.actualCalories + exercise.actual.calories
  }), {
    plannedDuration: 0,
    actualDuration: 0,
    plannedCalories: 0,
    actualCalories: 0
  });

  const handleWorkoutComplete = () => {
    const workoutPerformance = {
      exercises: SAMPLE_EXERCISES.map(exercise => ({
        muscleGroup: "chest", // À remplacer par la vraie donnée
        intensity: exercise.actual.duration / exercise.planned.duration,
        volume: 12, // À remplacer par le vrai nombre de répétitions
        duration: exercise.actual.duration,
        actualVsPlanned: exercise.actual.calories / exercise.planned.calories
      })),
      date: new Date()
    };

    const nextWorkoutRecommendation = getNextWorkoutRecommendation(workoutPerformance);

    // Sauvegarder les recommandations dans le localStorage
    localStorage.setItem('lastWorkoutPerformance', JSON.stringify(workoutPerformance));
    localStorage.setItem('nextWorkoutRecommendation', JSON.stringify(nextWorkoutRecommendation));

    const durationExcess = ((totals.actualDuration - totals.plannedDuration) / totals.plannedDuration) * 100;
    const caloriesExcess = ((totals.actualCalories - totals.plannedCalories) / totals.plannedCalories) * 100;

    if (durationExcess > 20 || caloriesExcess > 25) {
      toast({
        title: "Attention au surentraînement",
        description: `Votre performance dépasse significativement l'objectif. Le prochain entraînement sera ajusté avec ${Math.round(nextWorkoutRecommendation.recommendedIntensity * 100)}% d'intensité pour éviter le surentraînement.`,
        variant: "destructive"
      });
    } else if (durationExcess > 10 || caloriesExcess > 15) {
      toast({
        title: "Excellent travail !",
        description: `Vos objectifs ont été dépassés. Le prochain entraînement sera légèrement ajusté avec un volume de ${nextWorkoutRecommendation.recommendedVolume} répétitions.`,
      });
    }

    // Afficher les groupes musculaires à éviter
    if (nextWorkoutRecommendation.musclesNeedingRest.length > 0) {
      toast({
        title: "Récupération musculaire",
        description: `Groupes musculaires à éviter pour le prochain entraînement : ${nextWorkoutRecommendation.musclesNeedingRest.join(', ')}`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-6">
      <WorkoutHeader />

      <div className="flex justify-center gap-6 flex-wrap">
        <MetricComparison 
          planned={totals.plannedDuration} 
          actual={totals.actualDuration} 
          unit="min" 
          icon={Timer}
          label="Durée"
        />
        <Card className="p-4 flex items-center gap-2 bg-primary/5">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span>{SAMPLE_EXERCISES.length} exercices</span>
        </Card>
        <MetricComparison 
          planned={totals.plannedCalories} 
          actual={totals.actualCalories} 
          unit="kcal" 
          icon={Flame}
          label="Calories"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {SAMPLE_EXERCISES.map((exercise, index) => (
          <ExerciseCard key={index} exercise={exercise} />
        ))}
      </div>

      <div className="flex justify-center pt-6">
        <Button 
          size="lg" 
          className="w-full max-w-md"
          onClick={handleWorkoutComplete}
        >
          Terminer l'entraînement
        </Button>
      </div>
    </div>
  );
};
