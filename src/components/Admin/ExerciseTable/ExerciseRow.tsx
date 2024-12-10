import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DifficultyBadges } from "../DifficultyBadges";
import { LocationBadges } from "../LocationBadges";
import { MediaButtons } from "./MediaButtons";
import { UploadForm } from "../UploadForm";
import { useDifficultyManagement } from "@/hooks/use-difficulty-management";
import { useLocationManagement } from "@/hooks/use-location-management";

interface ExerciseRowProps {
  exercise: {
    id: string;
    name: string;
    difficulty: string[];
    location: string[];
    is_published: boolean;
  };
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onNameChange: (name: string) => void;
  onPublish: () => void;
  showImageUpload: boolean;
  showVideoUpload: boolean;
  onImageClick: () => void;
  onVideoClick: () => void;
  onUploadSuccess: () => void;
}

export const ExerciseRow = ({
  exercise,
  isSelected,
  onSelect,
  onNameChange,
  onPublish,
  showImageUpload,
  showVideoUpload,
  onImageClick,
  onVideoClick,
  onUploadSuccess,
}: ExerciseRowProps) => {
  const { selectedDifficulties, handleDifficultyChange } = useDifficultyManagement(
    exercise.id,
    exercise.difficulty || []
  );

  const { selectedLocations, handleLocationChange } = useLocationManagement(
    exercise.id,
    exercise.location || []
  );

  return (
    <TableRow>
      <TableCell>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      <TableCell>
        <Input
          type="text"
          value={exercise.name}
          onChange={(e) => onNameChange(e.target.value)}
          className="w-full"
        />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <DifficultyBadges 
            difficulties={["beginner", "intermediate", "advanced"]}
            selectedDifficulties={selectedDifficulties}
            onDifficultyChange={handleDifficultyChange}
          />
          <LocationBadges 
            locations={["home", "gym", "outdoor"]}
            selectedLocations={selectedLocations}
            onLocationChange={handleLocationChange}
          />
        </div>
      </TableCell>
      <TableCell>
        <MediaButtons
          isPublished={exercise.is_published}
          isPublishing={false}
          onPublishToggle={onPublish}
          onImageClick={onImageClick}
          onVideoClick={onVideoClick}
        />
        {showImageUpload && (
          <div className="mt-2">
            <UploadForm
              exerciseId={exercise.id}
              exerciseName={exercise.name}
              type="image"
              onSuccess={onUploadSuccess}
            />
          </div>
        )}
        {showVideoUpload && (
          <div className="mt-2">
            <UploadForm
              exerciseId={exercise.id}
              exerciseName={exercise.name}
              type="video"
              onSuccess={onUploadSuccess}
            />
          </div>
        )}
      </TableCell>
    </TableRow>
  );
};