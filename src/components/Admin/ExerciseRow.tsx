import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ExerciseMedia } from "@/types/exercise-media";
import { MediaButtons } from "./MediaButtons";
import { ExerciseHeader } from "./ExerciseHeader";
import { UploadSection } from "./ExerciseMedia/UploadSection";
import { MediaManager } from "./ExerciseMedia/MediaManager";
import { AdminExercise } from "./types/exercise";

interface ExerciseRowProps {
  exercise: AdminExercise;
  onUpload: () => void;
  selectedFile: File | null;
  media?: ExerciseMedia[];
  selectedDifficulties: string[];
  onDifficultyChange?: (difficulty: string) => void;
}

export const ExerciseRow = ({ 
  exercise, 
  onUpload,
  selectedFile,
  media = [],
  selectedDifficulties,
  onDifficultyChange
}: ExerciseRowProps) => {
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

  return (
    <Card className="mb-4 p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <ExerciseHeader
            name={exercise.name}
            muscleGroup={exercise.muscle_group}
            difficulties={exercise.difficulty}
            selectedDifficulties={selectedDifficulties}
            onDifficultyChange={onDifficultyChange}
          />
          <MediaButtons
            onImageClick={handleImageClick}
            onVideoClick={handleVideoClick}
            onPublish={() => {}}
            hasMedia={media.length > 0}
          />
        </div>

        <UploadSection
          showImageUpload={showImageUpload}
          showVideoUpload={showVideoUpload}
          exercise={exercise}
          onUpload={onUpload}
          selectedFile={selectedFile}
        />

        <MediaManager
          exercise={exercise}
          media={media}
          onUpload={onUpload}
        />
      </div>
    </Card>
  );
};