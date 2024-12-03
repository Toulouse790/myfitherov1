import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Timer, Dumbbell } from "lucide-react";
import { ExerciseSets } from "./ExerciseSets";
import { Card } from "@/components/ui/card";
import { exercises } from "./exerciseLibrary";

export const WorkoutExerciseDetail = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
  const exercise = exercises.find(ex => ex.id === exerciseId);

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 pt-16 pb-12">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <p className="text-center mt-8">Exercice non trouvé</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-16 pb-12">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Durée: 45 min</span>
          </div>
        </div>

        <Card className="p-6 animate-fade-in">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{exercise.name}</h1>
              <p className="text-muted-foreground">
                {exercise.description}
              </p>
            </div>
          </div>

          <ExerciseSets 
            exerciseName={exercise.name}
            initialSets={[
              { id: 1, reps: 12, weight: 10, completed: false },
              { id: 2, reps: 12, weight: 10, completed: false },
              { id: 3, reps: 12, weight: 10, completed: false },
            ]} 
          />
        </Card>
      </div>
    </div>
  );
};