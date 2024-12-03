import { exerciseImages } from "../data/exerciseImages";

interface ExerciseListProps {
  exercises: string[];
  currentExerciseIndex: number | null;
  isWorkoutStarted: boolean;
  onExerciseClick: (index: number) => void;
}

export const ExerciseList = ({ 
  exercises, 
  currentExerciseIndex, 
  isWorkoutStarted,
  onExerciseClick 
}: ExerciseListProps) => {
  return (
    <div className="space-y-4">
      {exercises.map((exercise, index) => (
        <div 
          key={index} 
          onClick={() => isWorkoutStarted && onExerciseClick(index)}
          className={`
            p-4 rounded-lg transition-all duration-300 cursor-pointer
            ${currentExerciseIndex === index ? 'bg-primary/5 ring-1 ring-primary' : 'hover:bg-muted/50'}
            ${!isWorkoutStarted && 'opacity-50 cursor-not-allowed'}
          `}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <img 
                src={exerciseImages[exercise]} 
                alt={exercise}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="font-medium">{exercise}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};