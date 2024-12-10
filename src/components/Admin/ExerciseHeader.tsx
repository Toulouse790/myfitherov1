import { DifficultyBadges } from "./DifficultyBadges";
import { LocationBadges } from "./LocationBadges";

interface ExerciseHeaderProps {
  name: string;
  muscleGroup: string;
  difficulties: string[];
  selectedDifficulties: string[];
  onDifficultyChange?: (difficulty: string) => void;
  locations: string[];
  selectedLocations: string[];
  onLocationChange?: (location: string) => void;
}

export const ExerciseHeader = ({ 
  name, 
  muscleGroup, 
  difficulties,
  selectedDifficulties,
  onDifficultyChange,
  locations,
  selectedLocations,
  onLocationChange
}: ExerciseHeaderProps) => {
  return (
    <div className="space-y-2">
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-600">{muscleGroup}</p>
      </div>
      <div className="space-y-2">
        <DifficultyBadges 
          difficulties={difficulties} 
          selectedDifficulties={selectedDifficulties}
          onDifficultyChange={onDifficultyChange}
        />
        <LocationBadges 
          locations={locations}
          selectedLocations={selectedLocations}
          onLocationChange={onLocationChange}
        />
      </div>
    </div>
  );
};