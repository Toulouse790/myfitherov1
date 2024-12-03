import { exerciseImages } from "../data/exerciseImages";
import { Dumbbell } from "lucide-react";

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
            ${currentExerciseIndex === index ? 'bg-primary/10 ring-1 ring-primary' : 'hover:bg-[#252B3B]'}
            ${!isWorkoutStarted && 'opacity-50 cursor-not-allowed'}
          `}
        >
          <div className="flex items-center gap-4">
            <div className="relative w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-white">{exercise}</h3>
              <p className="text-sm text-gray-400">3 séries • 12 répétitions</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};