import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, CheckCircle2 } from "lucide-react";
import { ExerciseDetail } from "./ExerciseDetail";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  completed: boolean;
}

export const ExerciseList = () => {
  const [exercises] = useState<Exercise[]>([
    { id: "1", name: "Développé couché", sets: 4, reps: 12, completed: false },
    { id: "2", name: "Rowing barre", sets: 4, reps: 12, completed: false },
    { id: "3", name: "Squat", sets: 4, reps: 12, completed: false },
    { id: "4", name: "Développé épaules", sets: 4, reps: 12, completed: false }
  ]);

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const handleExerciseComplete = (exerciseId: string) => {
    setSelectedExercise(null);
  };

  if (selectedExercise) {
    return (
      <ExerciseDetail
        exercise={selectedExercise}
        onComplete={handleExerciseComplete}
        onBack={() => setSelectedExercise(null)}
      />
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center mb-6">Programme d'aujourd'hui</h1>
      <div className="grid gap-4">
        {exercises.map((exercise) => (
          <Card
            key={exercise.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
              exercise.completed ? "bg-muted" : "hover:border-primary"
            }`}
            onClick={() => !exercise.completed && setSelectedExercise(exercise)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  {exercise.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  ) : (
                    <Dumbbell className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium">{exercise.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {exercise.sets} séries • {exercise.reps} répétitions
                  </p>
                </div>
              </div>
              {!exercise.completed && (
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedExercise(exercise);
                  }}
                >
                  Commencer
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};