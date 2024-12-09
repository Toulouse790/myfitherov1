import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Video } from "lucide-react";
import { DifficultyBadges } from "./DifficultyBadges";
import { UploadForm } from "./UploadForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ExerciseRowProps {
  exercise: {
    id: string;
    name: string;
    muscle_group: string;
    difficulty: string[];
    exercise_media?: {
      media_type: string;
      media_url: string;
    }[];
  };
  onUpdate: () => void;
}

export const ExerciseRow = ({ exercise, onUpdate }: ExerciseRowProps) => {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showVideoUpload, setShowVideoUpload] = useState(false);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(exercise.difficulty || []);
  const { toast } = useToast();

  const handleDifficultyChange = async (difficulty: string) => {
    const newDifficulties = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter(d => d !== difficulty)
      : [...selectedDifficulties, difficulty];

    try {
      const { error } = await supabase
        .from('exercises')
        .update({ difficulty: newDifficulties })
        .eq('id', exercise.id);

      if (error) throw error;

      setSelectedDifficulties(newDifficulties);
      toast({
        title: "Succès",
        description: "Difficulté mise à jour",
      });
    } catch (error) {
      console.error('Error updating difficulty:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la difficulté",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">{exercise.name}</h3>
            <p className="text-sm text-gray-600">{exercise.muscle_group}</p>
            <DifficultyBadges
              difficulties={["beginner", "intermediate", "advanced"]}
              selectedDifficulties={selectedDifficulties}
              onDifficultyChange={handleDifficultyChange}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => {
                setShowImageUpload(!showImageUpload);
                setShowVideoUpload(false);
              }}
            >
              <Image className="mr-2 h-4 w-4" />
              Image
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-purple-500 hover:bg-purple-600 text-white"
              onClick={() => {
                setShowVideoUpload(!showVideoUpload);
                setShowImageUpload(false);
              }}
            >
              <Video className="mr-2 h-4 w-4" />
              Vidéo
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
          {exercise.exercise_media?.map((media, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden">
              {media.media_type === "image" ? (
                <img
                  src={media.media_url}
                  alt={exercise.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  src={media.media_url}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};