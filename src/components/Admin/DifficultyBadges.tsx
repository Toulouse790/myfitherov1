import { Badge } from "@/components/ui/badge";

interface DifficultyBadgesProps {
  difficulties: string[];
  onDifficultyChange?: (difficulty: string) => void;
}

export const DifficultyBadges = ({
  difficulties,
  onDifficultyChange,
}: DifficultyBadgesProps) => {
  const difficultyLevels = ["débutant", "intermédiaire", "avancé", "expert"];

  return (
    <div className="flex gap-2 flex-wrap flex-1">
      {difficultyLevels.map((difficulty) => (
        <Badge
          key={difficulty}
          variant={difficulties.includes(difficulty) ? "default" : "outline"}
          className={`cursor-pointer ${
            difficulties.includes(difficulty)
              ? "bg-[#9b87f5] hover:bg-[#7E69AB]"
              : "border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white"
          }`}
          onClick={() => onDifficultyChange?.(difficulty)}
        >
          {difficulty}
        </Badge>
      ))}
    </div>
  );
};