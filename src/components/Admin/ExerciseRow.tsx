import { Card } from "@/components/ui/card";
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
    is_published?: boolean;
    image_url?: string;
    video_url?: string;
  };
  onUpdate: () => void;
}

export const ExerciseRow = ({ exercise, onUpdate }: ExerciseRowProps) => {
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
    exercise.is_published || false,
    () => {
      console.log("Publication status changed, calling onUpdate");
      onUpdate();
    }
  );

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <ExerciseMedia 
              exercise={exercise}
              isPublishing={isPublishing}
              onPublishToggle={handlePublishToggle}
              onUpdate={onUpdate}
            />
            <div className="space-y-2">
              <div>
                <h3 className="text-lg font-semibold">{exercise.name}</h3>
                <p className="text-sm text-gray-600">{exercise.muscle_group}</p>
              </div>
              <ExerciseBadges 
                selectedDifficulties={selectedDifficulties}
                selectedLocations={selectedLocations}
                onDifficultyChange={(difficulty: string, checked: boolean) => handleDifficultyChange(difficulty, checked)}
                onLocationChange={(location: string, checked: boolean) => handleLocationChange(location, checked)}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};