interface ExerciseTimelineProps {
  exercises: string[];
  currentExerciseIndex: number;
}

export const ExerciseTimeline = ({ exercises, currentExerciseIndex }: ExerciseTimelineProps) => {
  return (
    <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
      {exercises.map((exercise, index) => (
        <div
          key={index}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-sm ${
            index === currentExerciseIndex
              ? 'bg-primary text-primary-foreground'
              : index < currentExerciseIndex
              ? 'bg-muted text-muted-foreground'
              : 'bg-secondary/10 text-secondary-foreground'
          }`}
        >
          {exercise}
        </div>
      ))}
    </div>
  );
};