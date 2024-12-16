import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useDifficultyManagement } from "@/hooks/use-difficulty-management";
import { useLocationManagement } from "@/hooks/use-location-management";
import { usePublishManagement } from "@/hooks/use-publish-management";
import { ExerciseMedia } from "./ExerciseRow/ExerciseMedia";
import { ExerciseBadges } from "./ExerciseRow/ExerciseBadges";

interface ExerciseRowProps {
  exercise: {
    id: string;
    name: string;
    muscle_group: string;
    difficulty: string[];
    location?: string[];
    est_publié?: boolean;
    image_url?: string;
    video_url?: string;
  };
  onUpdate: () => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const ExerciseRow = ({ 
  exercise, 
  onUpdate,
  isSelected,
  onSelect
}: ExerciseRowProps) => {
  const { selectedDifficulties, handleDifficultyChange } = useDifficultyManagement(
    exercise.id,
    exercise.difficulty || []
  );

  const { selectedLocations, handleLocationChange } = useLocationManagement(
    exercise.id,
    exercise.location || []
  );
  
  const { isPublishing, handlePublishToggle } = usePublishManagement(
    exercise.id,
    exercise.est_publié || false,
    () => {
      console.log("Publication status changed, calling onUpdate");
      onUpdate();
    }
  );

  return (
    <Card className="p-6 bg-white shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-100">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => onSelect()}
              className="mt-1"
            />
            <ExerciseMedia 
              exercise={exercise}
              isPublishing={isPublishing}
              onPublishToggle={handlePublishToggle}
              onUpdate={onUpdate}
            />
            <div className="space-y-3">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{exercise.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{exercise.muscle_group}</p>
              </div>
              <ExerciseBadges 
                selectedDifficulties={selectedDifficulties}
                selectedLocations={selectedLocations}
                onDifficultyChange={handleDifficultyChange}
                onLocationChange={handleLocationChange}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};