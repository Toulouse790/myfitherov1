import { Badge } from "@/components/ui/badge";

interface DifficultyBadgesProps {
  selectedDifficulties: string[];
  onDifficultyChange: (difficulty: string) => void;
}

export const DifficultyBadges = ({
  selectedDifficulties,
  onDifficultyChange,
}: DifficultyBadgesProps) => {
  const difficulties = ["débutant", "intermédiaire", "avancé", "expert"];

  return (
    <div className="flex gap-2 flex-wrap flex-1">
      {difficulties.map((difficulty) => (
        <Badge
          key={difficulty}
          variant={selectedDifficulties.includes(difficulty) ? "default" : "outline"}
          className={`cursor-pointer ${
            selectedDifficulties.includes(difficulty)
              ? "bg-[#9b87f5] hover:bg-[#7E69AB]"
              : "border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white"
          }`}
          onClick={() => onDifficultyChange(difficulty)}
        >
          {difficulty}
        </Badge>
      ))}
    </div>
  );
};