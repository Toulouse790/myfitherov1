import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Video } from "lucide-react";
import { UploadForm } from "./UploadForm";
import { DifficultyBadges } from "./DifficultyBadges";
import { useState } from "react";
import { ExerciseMedia } from "@/types/exercise-media";

interface ExerciseRowProps {
  exercise: {
    id: string;
    name: string;
    muscle_group: string;
    difficulty: string[];
  };
  onUpload: () => void;
  selectedFile: File | null;
  media?: ExerciseMedia[];
}

export const ExerciseRow = ({ 
  exercise, 
  onUpload,
  selectedFile,
  media 
}: ExerciseRowProps) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);

  const handleImageClick = () => {
    setShowImageUpload(true);
    setShowVideoUpload(false);
  };

  const handleVideoClick = () => {
    setShowVideoUpload(true);
    setShowImageUpload(false);
  };

  return (
    <Card className="mb-4 p-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
            <p className="text-sm text-gray-600">{exercise.muscle_group}</p>
            <DifficultyBadges difficulties={exercise.difficulty} />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={handleImageClick}
            >
              <Image className="mr-2 h-4 w-4" />
              Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={handleVideoClick}
            >
              <Video className="mr-2 h-4 w-4" />
              Vidéo
            </Button>
          </div>
        </div>

        <div>
          {(showImageUpload || showVideoUpload) && (
            <div className="mt-4">
              <UploadForm
                exercise_id={exercise.id}
                type={showImageUpload ? "image" : "video"}
                onUpload={onUpload}
                selectedFile={selectedFile}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};