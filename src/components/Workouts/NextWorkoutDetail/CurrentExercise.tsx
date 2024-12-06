import { ExerciseSets } from "../ExerciseSets";

interface CurrentExerciseProps {
  exercises: string[];
  currentExerciseIndex: number | null;
}

export const CurrentExercise = ({ 
  exercises,
  currentExerciseIndex 
}: CurrentExerciseProps) => {
  if (currentExerciseIndex === null || !exercises[currentExerciseIndex]) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Sélectionnez un exercice pour commencer
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{exercises[currentExerciseIndex]}</h2>
      <ExerciseSets exercises={[exercises[currentExerciseIndex]]} />
    </div>
  );
};