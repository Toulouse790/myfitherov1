import { useState } from "react";
import { UploadForm } from "../UploadForm";
import { MediaButtons } from "../MediaButtons";
import { MediaPreview } from "../MediaPreview";

interface ExerciseMediaProps {
  exercise: {
    id: string;
    name: string;
    is_published?: boolean;
    image_url?: string;
    video_url?: string;
  };
  isPublishing: boolean;
  onPublishToggle: () => void;
  onUpdate: () => void;
}

export const ExerciseMedia = ({ 
  exercise, 
  isPublishing, 
  onPublishToggle, 
  onUpdate 
}: ExerciseMediaProps) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  const handleImageClick = () => {
    setShowImageUpload(!showImageUpload);
    setShowVideoUpload(false);
  };

  const handleVideoClick = () => {
    setShowVideoUpload(!showVideoUpload);
    setShowImageUpload(false);
  };

  const handleUploadSuccess = () => {
    setShowImageUpload(false);
    setShowVideoUpload(false);
    onUpdate();
  };

  const mediaUrls = [
    ...(exercise.image_url ? [{ type: 'image' as const, url: exercise.image_url }] : []),
    ...(exercise.video_url ? [{ type: 'video' as const, url: exercise.video_url }] : [])
  ];

  return (
    <>
      <MediaButtons 
        isPublished={exercise.is_published}
        isPublishing={isPublishing}
        onPublishToggle={onPublishToggle}
        onImageClick={handleImageClick}
        onVideoClick={handleVideoClick}
      />

      {(showImageUpload || showVideoUpload) && (
        <UploadForm
          exerciseId={exercise.id}
          exerciseName={exercise.name}
          type={showImageUpload ? "image" : "video"}
          onSuccess={handleUploadSuccess}
        />
      )}

      <MediaPreview 
        isOpen={false}
        onClose={() => {}}
        onConfirm={() => {}}
        mediaUrls={mediaUrls}
        exerciseName={exercise.name}
      />
    </>
  );
};