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
    <div className="space-y-8">
      {exercises.map((exercise, index) => (
        <div 
          key={index} 
          className={`space-y-4 cursor-pointer transition-all duration-300 ${
            currentExerciseIndex === index ? 'ring-2 ring-primary rounded-lg p-4' : ''
          }`}
          onClick={() => isWorkoutStarted && onExerciseClick(index)}
        >
          <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
            <img 
              src={exerciseImages[exercise]} 
              alt={exercise}
              className="w-full h-full object-cover"
            />
            {!isWorkoutStarted && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white text-sm">Démarrez l'entraînement pour accéder à l'exercice</p>
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-semibold text-white">{exercise}</h2>
        </div>
      ))}
    </div>
  );
};