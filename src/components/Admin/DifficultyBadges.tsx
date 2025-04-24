
import { Badge } from "@/components/ui/badge";
import { useExerciseTranslation } from "@/hooks/use-exercise-translation";

interface DifficultyBadgesProps {
  difficulties: string[];
  selectedDifficulties: string[];
  onDifficultyChange?: (difficulty: string, checked: boolean) => void;
}

export const DifficultyBadges = ({
  difficulties,
  selectedDifficulties,
  onDifficultyChange,
}: DifficultyBadgesProps) => {
  const { translateDifficulty } = useExerciseTranslation();

  return (
    <div className="flex gap-2">
      {difficulties.map((difficulty) => (
        <Badge
          key={difficulty}
          variant={selectedDifficulties.includes(difficulty) ? "default" : "outline"}
          className={`cursor-pointer transition-colors ${
            selectedDifficulties.includes(difficulty)
              ? 'bg-[#9b87f5] hover:bg-[#7E69AB]'
              : 'border-[#6E59A5] text-[#6E59A5] hover:bg-[#6E59A5] hover:text-white'
          }`}
          onClick={() => onDifficultyChange?.(difficulty, !selectedDifficulties.includes(difficulty))}
        >
          {translateDifficulty(difficulty)}
        </Badge>
      ))}
    </div>
  );
};
