import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Timer, Dumbbell, Flame, ArrowUp, ArrowDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

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

const MetricComparison = ({ planned, actual, unit, icon: Icon }) => {
  const isExceeded = actual > planned;
  const difference = actual - planned;
  
  return (
    <Card className="p-4 flex items-center gap-2 bg-primary/5">
      <Icon className="h-5 w-5 text-primary" />
      <div className="flex items-center gap-2">
        <span>{actual} {unit}</span>
        {isExceeded ? (
          <div className="flex items-center text-green-500 text-sm">
            <ArrowUp className="h-3 w-3" />
            <span>+{difference}</span>
          </div>
        ) : difference < 0 ? (
          <div className="flex items-center text-orange-500 text-sm">
            <ArrowDown className="h-3 w-3" />
            <span>{difference}</span>
          </div>
        ) : null}
      </div>
    </Card>
  );
};

export const NextWorkoutDetail = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Calculer les totaux
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
    // Vérifier si l'entraînement est trop intense
    const durationExcess = ((totals.actualDuration - totals.plannedDuration) / totals.plannedDuration) * 100;
    const caloriesExcess = ((totals.actualCalories - totals.plannedCalories) / totals.plannedCalories) * 100;

    if (durationExcess > 20 || caloriesExcess > 25) {
      toast({
        title: "Attention au surentraînement",
        description: "Votre performance dépasse significativement l'objectif. Le prochain entraînement sera ajusté pour éviter le surentraînement.",
        variant: "destructive"
      });
    } else if (durationExcess > 10 || caloriesExcess > 15) {
      toast({
        title: "Excellent travail !",
        description: "Vos objectifs ont été dépassés. Le prochain entraînement sera légèrement ajusté pour optimiser vos progrès.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 pt-24 pb-12 space-y-6">
      <Button 
        variant="ghost" 
        className="mb-6"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour
      </Button>

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Prochain Entraînement (IA)
          </h1>
          <p className="text-muted-foreground mt-2">
            Dos, Biceps, Épaules
          </p>
        </div>

        <div className="flex justify-center gap-6 flex-wrap">
          <MetricComparison 
            planned={totals.plannedDuration} 
            actual={totals.actualDuration} 
            unit="mins" 
            icon={Timer} 
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
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {SAMPLE_EXERCISES.map((exercise, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video">
                <img 
                  src={exercise.image} 
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-4">
                <h3 className="font-semibold text-lg">{exercise.name}</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center p-2 bg-secondary/10 rounded-lg">
                    <div className="font-medium">{exercise.sets}</div>
                    <div className="text-muted-foreground">Séries</div>
                  </div>
                  <div className="text-center p-2 bg-secondary/10 rounded-lg">
                    <div className="font-medium">{exercise.reps}</div>
                    <div className="text-muted-foreground">Reps</div>
                  </div>
                  <div className="text-center p-2 bg-secondary/10 rounded-lg">
                    <div className="font-medium">{exercise.rest}s</div>
                    <div className="text-muted-foreground">Repos</div>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className={exercise.actual.duration > exercise.planned.duration ? "text-green-500" : ""}>
                      {exercise.actual.duration}min
                    </span>
                    <span className="text-muted-foreground">/ {exercise.planned.duration}min</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-muted-foreground" />
                    <span className={exercise.actual.calories > exercise.planned.calories ? "text-green-500" : ""}>
                      {exercise.actual.calories}
                    </span>
                    <span className="text-muted-foreground">/ {exercise.planned.calories} kcal</span>
                  </div>
                </div>
              </div>
            </Card>
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
    </div>
  );
};