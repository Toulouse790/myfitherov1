import { DifficultyBadges } from "../DifficultyBadges";
import { LocationBadges } from "../LocationBadges";

interface ExerciseBadgesProps {
  selectedDifficulties: string[];
  selectedLocations: string[];
  onDifficultyChange: (difficulty: string, checked: boolean) => void;
  onLocationChange: (location: string, checked: boolean) => void;
}

export const ExerciseBadges = ({
  selectedDifficulties,
  selectedLocations,
  onDifficultyChange,
  onLocationChange
}: ExerciseBadgesProps) => {
  return (
    <div className="space-y-2">
      <DifficultyBadges 
        difficulties={["beginner", "intermediate", "advanced"]}
        selectedDifficulties={selectedDifficulties}
        onDifficultyChange={onDifficultyChange}
      />
      <LocationBadges 
        locations={["home", "gym", "outdoor"]}
        selectedLocations={selectedLocations}
        onLocationChange={onLocationChange}
      />
    </div>
  );
};