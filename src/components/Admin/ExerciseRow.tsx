import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Video, Check, Upload } from "lucide-react";
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
    is_published?: boolean;
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
  const [isPublishing, setIsPublishing] = useState(false);
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

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from('exercises')
        .update({ is_published: !exercise.is_published })
        .eq('id', exercise.id);

      if (error) throw error;

      onUpdate();
      toast({
        title: "Succès",
        description: exercise.is_published 
          ? "Exercice retiré de la publication" 
          : "Exercice publié avec succès",
      });
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de publication",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
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