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
  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${
        activeExercise === index ? 'border-primary bg-primary/5' : ''
      }`}
    >
      <div className="space-y-4">
        <ExerciseHeader
          name={exercise.name}
          isActive={activeExercise === index}
          onStart={onStart}
        />

        {activeExercise === index && (
          <div className="flex flex-col space-y-4 md:w-2/3 lg:w-1/2">
            {Array.from({ length: exercise.sets }).map((_, setIndex) => (
              <div key={setIndex} className="flex items-center gap-4">
                <ExerciseSet
                  setIndex={setIndex}
                  isCompleted={(completedSets[index] || 0) > setIndex}
                  isNext={(completedSets[index] || 0) === setIndex}
                  reps={exercise.reps}
                  restTimer={restTimer}
                  onComplete={() => onSetComplete(index)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};