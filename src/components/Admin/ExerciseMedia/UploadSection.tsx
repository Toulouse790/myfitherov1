import { UploadForm } from "../UploadForm";
import { UploadSectionProps } from "../types/media";

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
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          type="image"
          onSuccess={onUpload}
        />
      )}
      {showVideoUpload && (
        <UploadForm
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          type="video"
          onSuccess={onUpload}
        />
      )}
    </div>
  );
};