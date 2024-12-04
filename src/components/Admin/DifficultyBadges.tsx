import { Badge } from "@/components/ui/badge";

interface DifficultyBadgesProps {
  selectedDifficulties: string[];
  onDifficultyChange: (difficulty: string) => void;
}

export const DifficultyBadges = ({
  selectedDifficulties,
  onDifficultyChange,
}: DifficultyBadgesProps) => {
  const difficulties = ["beginner", "intermediate", "advanced", "expert"];

  return (
    <div className="flex gap-2 flex-wrap flex-1">
      {difficulties.map((difficulty) => (
        <Badge
          key={difficulty}
          variant={selectedDifficulties.includes(difficulty) ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onDifficultyChange(difficulty)}
        >
          {difficulty}
        </Badge>
      ))}
    </div>
  );
};