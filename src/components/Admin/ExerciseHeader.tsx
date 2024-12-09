import { DifficultyBadges } from "./DifficultyBadges";

interface ExerciseHeaderProps {
  name: string;
  muscleGroup: string;
  difficulties: string[];
  selectedDifficulties: string[];
  onDifficultyChange?: (difficulty: string) => void;
}

export const ExerciseHeader = ({ 
  name, 
  muscleGroup, 
  difficulties,
  selectedDifficulties,
  onDifficultyChange 
}: ExerciseHeaderProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-sm text-gray-600">{muscleGroup}</p>
      <DifficultyBadges 
        difficulties={difficulties} 
        selectedDifficulties={selectedDifficulties}
        onDifficultyChange={onDifficultyChange}
      />
    </div>
  );
};