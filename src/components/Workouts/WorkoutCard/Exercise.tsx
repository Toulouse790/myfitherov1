import { ExerciseHeader } from "./ExerciseHeader";
import { ExerciseSet } from "./ExerciseSet";

interface ExerciseProps {
  exercise: {
    name: string;
    sets: number;
    reps: number;
  };
  index: number;
  activeExercise: number | null;
  completedSets: { [key: number]: number };
  restTimer: number | null;
  onStart: () => void;
  onSetComplete: (exerciseIndex: number) => void;
}

export const Exercise = ({
  exercise,
  index,
  activeExercise,
  completedSets,
  restTimer,
  onStart,
  onSetComplete,
}: ExerciseProps) => {
  const isActive = activeExercise === index;
  
  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        isActive ? 'border-primary bg-primary/5' : ''
      }`}
    >
      <div className="flex flex-col gap-4">
        <ExerciseHeader
          name={exercise.name}
          isActive={isActive}
          onStart={onStart}
        />

        {isActive && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: exercise.sets }).map((_, setIndex) => (
              <ExerciseSet
                key={setIndex}
                setIndex={setIndex}
                isCompleted={(completedSets[index] || 0) > setIndex}
                isNext={(completedSets[index] || 0) === setIndex}
                reps={exercise.reps}
                restTimer={restTimer}
                onComplete={() => onSetComplete(index)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};