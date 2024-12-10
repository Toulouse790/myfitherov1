import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Video, Check, Upload } from "lucide-react";
import { DifficultyBadges } from "./DifficultyBadges";
import { LocationBadges } from "./LocationBadges";
import { UploadForm } from "./UploadForm";
import { useDifficultyManagement } from "@/hooks/use-difficulty-management";
import { useLocationManagement } from "@/hooks/use-location-management";
import { usePublishManagement } from "@/hooks/use-publish-management";

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
                onDifficultyChange={(difficulty, checked) => 
                  handleDifficultyChange(difficulty, checked)
                }
              />
              <LocationBadges 
                locations={["home", "gym", "outdoor"]}
                selectedLocations={selectedLocations}
                onLocationChange={(location, checked) => 
                  handleLocationChange(location, checked)
                }
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePublishToggle}
              disabled={isPublishing}
              className={`${
                exercise.is_published 
                  ? "bg-green-500 hover:bg-green-600" 
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {exercise.is_published ? (
                <Check className="h-4 w-4" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                setShowImageUpload(!showImageUpload);
                setShowVideoUpload(false);
              }}
            >
              <Image className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => {
                setShowVideoUpload(!showVideoUpload);
                setShowImageUpload(false);
              }}
            >
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {(showImageUpload || showVideoUpload) && (
          <UploadForm
            exerciseId={exercise.id}
            exerciseName={exercise.name}
            type={showImageUpload ? "image" : "video"}
            onSuccess={() => {
              setShowImageUpload(false);
              setShowVideoUpload(false);
              onUpdate();
            }}
          />
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          {exercise.image_url && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={exercise.image_url}
                alt={exercise.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {exercise.video_url && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <video
                src={exercise.video_url}
                controls
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};