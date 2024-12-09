import { Badge } from "@/components/ui/badge";

interface DifficultyBadgesProps {
  difficulties: string[];
  onDifficultyChange?: (difficulty: string) => void;
  selectedDifficulties: string[];
}

const difficultyTranslations: { [key: string]: string } = {
  "beginner": "débutant",
  "intermediate": "intermédiaire",
  "advanced": "avancé"
};

export const DifficultyBadges = ({
  difficulties,
  onDifficultyChange,
  selectedDifficulties,
}: DifficultyBadgesProps) => {
  const difficultyLevels = ["beginner", "intermediate", "advanced"];

  return (
    <div className="flex gap-2 flex-wrap flex-1">
      {difficultyLevels.map((difficulty) => (
        <Badge
          key={difficulty}
          variant={selectedDifficulties.includes(difficulty) ? "default" : "outline"}
          className={`cursor-pointer ${
            selectedDifficulties.includes(difficulty)
              ? "bg-[#9b87f5] hover:bg-[#7E69AB]"
              : "border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-white"
          }`}
          onClick={() => onDifficultyChange?.(difficulty)}
        >
          {difficultyTranslations[difficulty] || difficulty}
        </Badge>
      ))}
    </div>
  );
};