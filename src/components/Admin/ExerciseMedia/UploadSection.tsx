import { UploadForm } from "../UploadForm";
import { AdminExercise } from "../types/exercise";

interface UploadSectionProps {
  showImageUpload: boolean;
  showVideoUpload: boolean;
  exercise: AdminExercise;
  onUpload: () => void;
  selectedFile: File | null;
}

export const UploadSection = ({
  showImageUpload,
  showVideoUpload,
  exercise,
  onUpload,
  selectedFile
}: UploadSectionProps) => {
  if (!showImageUpload && !showVideoUpload) return null;

  return (
    <div className="mt-4">
      {showImageUpload && (
        <UploadForm
          exercise_id={exercise.id}
          exercise_name={exercise.name}
          type="image"
          onUpload={onUpload}
          selectedFile={selectedFile}
          difficulty={exercise.difficulty}
          location={exercise.location || []}
        />
      )}
      {showVideoUpload && (
        <UploadForm
          exercise_id={exercise.id}
          exercise_name={exercise.name}
          type="video"
          onUpload={onUpload}
          selectedFile={selectedFile}
          difficulty={exercise.difficulty}
          location={exercise.location || []}
        />
      )}
    </div>
  );
};