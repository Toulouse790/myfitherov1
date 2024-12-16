import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="flex gap-2">
      {difficulties.map((difficulty) => (
        <Badge
          key={difficulty}
          variant={selectedDifficulties.includes(difficulty) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onDifficultyChange?.(difficulty, !selectedDifficulties.includes(difficulty))}
        >
          {difficulty}
        </Badge>
      ))}
    </div>
  );
};