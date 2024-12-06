import { Exercise } from "@/hooks/use-exercises";
import { Dumbbell } from "lucide-react";

interface ExerciseListProps {
  exercises: Exercise[];
  selectedExercise: number | null;
  onExerciseClick: (index: number) => void;
  exerciseSets: number[][];
  onRepsChange: (exerciseIndex: number, setIndex: number, value: string) => void;
}

export const ExerciseList = ({
  exercises,
  selectedExercise,
  onExerciseClick,
  exerciseSets,
  onRepsChange
}: ExerciseListProps) => {
  return (
    <div className="space-y-2">
      {exercises.map((exercise, index) => (
        <div key={exercise.id} className="space-y-2">
          <div 
            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/10 hover:bg-secondary/20 transition-colors cursor-pointer"
            onClick={() => onExerciseClick(index)}
          >
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-foreground">{exercise.name}</p>
              <p className="text-xs text-muted-foreground">
                {exercise.defaultSets} séries • {exercise.defaultReps} répétitions
              </p>
            </div>
          </div>

          {selectedExercise === index && exerciseSets[index] && (
            <div className="pl-11 space-y-2 animate-fade-down">
              {Array.from({ length: exercise.defaultSets }).map((_, setIndex) => (
                <div key={setIndex} className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-16">
                    Série {setIndex + 1}
                  </span>
                  <input
                    type="number"
                    value={exerciseSets[index][setIndex]}
                    onChange={(e) => onRepsChange(index, setIndex, e.target.value)}
                    className="w-20 h-8 text-sm bg-background border-input text-foreground rounded px-2"
                    min="1"
                  />
                  <span className="text-xs text-muted-foreground">reps</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};