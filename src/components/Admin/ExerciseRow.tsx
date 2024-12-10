import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DifficultyBadges } from "./DifficultyBadges";
import { LocationBadges } from "./LocationBadges";
import { UploadForm } from "./UploadForm";
import { useDifficultyManagement } from "@/hooks/use-difficulty-management";
import { useLocationManagement } from "@/hooks/use-location-management";
import { usePublishManagement } from "@/hooks/use-publish-management";
import { MediaButtons } from "./MediaButtons";
import { MediaPreview } from "./MediaPreview";

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
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  
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
    onUpdate
  );

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
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div>
              <h3 className="text-lg font-semibold">{exercise.name}</h3>
              <p className="text-sm text-gray-600">{exercise.muscle_group}</p>
            </div>
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
          </div>
          <MediaButtons 
            isPublished={exercise.is_published}
            isPublishing={isPublishing}
            onPublishToggle={handlePublishToggle}
            onImageClick={handleImageClick}
            onVideoClick={handleVideoClick}
          />
        </div>

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
      </div>
    </Card>
  );
};