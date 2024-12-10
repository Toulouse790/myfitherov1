import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ExerciseBadges } from "./ExerciseBadges";
import { MediaButtons } from "./MediaButtons";
import { UploadForm } from "../UploadForm";

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
        <ExerciseBadges 
          difficulties={exercise.difficulty} 
          locations={exercise.location || []}
        />
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
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPublish}
        >
          {exercise.is_published ? 'Dépublier' : 'Publier'}
        </Button>
      </TableCell>
    </TableRow>
  );
};