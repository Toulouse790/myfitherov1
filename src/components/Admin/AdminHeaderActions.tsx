import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { MediaButtons } from "./MediaButtons";

interface AdminHeaderActionsProps {
  selectedExercises: string[];
  onPublish: (exerciseId: string, name: string) => void;
}

export const AdminHeaderActions = ({
  selectedExercises,
  onPublish,
}: AdminHeaderActionsProps) => {
  const [isPublishing, setIsPublishing] = useState(false);
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

  const handlePublishToggle = async () => {
    if (selectedExercises.length === 0) return;
    
    setIsPublishing(true);
    try {
      // Publish each selected exercise
      for (const exerciseId of selectedExercises) {
        await onPublish(exerciseId, ''); // Empty string as we don't need to update the name
      }
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex items-center justify-between w-full">
      <Button 
        variant="default"
        size="sm" 
        onClick={handlePublishToggle}
        className="gap-2 bg-green-600 hover:bg-green-700"
        disabled={selectedExercises.length === 0}
      >
        <Upload className="w-4 h-4" />
        Publier les exercices sélectionnés
      </Button>

      <div className="flex gap-2">
        <MediaButtons
          isPublished={false}
          isPublishing={isPublishing}
          onPublishToggle={handlePublishToggle}
          onImageClick={handleImageClick}
          onVideoClick={handleVideoClick}
        />
      </div>
    </div>
  );
};