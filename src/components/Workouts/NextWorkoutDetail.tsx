import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useWorkoutSession } from "@/hooks/use-workout-session";

export const NextWorkoutDetail = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const { exercises, currentExerciseIndex } = useWorkoutSession();

  const currentExercise = currentExerciseIndex !== null ? exercises[currentExerciseIndex] : null;

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <Card className="p-6 space-y-6">
        {currentExercise ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{currentExercise}</h2>
            <div className="text-muted-foreground">
              <p>Séries totales : 3</p>
            </div>
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Aucun exercice sélectionné
          </p>
        )}
      </Card>
    </div>
  );
};