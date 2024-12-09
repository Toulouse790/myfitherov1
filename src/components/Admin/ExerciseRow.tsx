import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ExerciseMedia } from "@/types/exercise-media";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaButtons } from "./MediaButtons";
import { ExerciseHeader } from "./ExerciseHeader";
import { MediaSection } from "./MediaSection";
import { UploadForm } from "./UploadForm";

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
  const { toast } = useToast();

  const handleImageClick = () => {
    setShowImageUpload(!showImageUpload);
    setShowVideoUpload(false);
  };

  const handleVideoClick = () => {
    setShowVideoUpload(!showVideoUpload);
    setShowImageUpload(false);
  };

  const handleDelete = async (url: string, exerciseName: string, type: 'image' | 'video') => {
    try {
      const { error } = await supabase
        .from('exercise_media')
        .delete()
        .eq('media_url', url)
        .eq('exercise_name', exerciseName)
        .eq('media_type', type);

      if (error) throw error;

      toast({
        title: "Média supprimé",
        description: `Le ${type === 'image' ? 'l\'image' : 'la vidéo'} a été supprimé(e)`,
      });

      onUpload();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le média",
        variant: "destructive",
      });
    }
  };

  const handlePublish = () => {
    toast({
      title: "Publication en cours",
      description: "Les médias sont en cours de publication...",
    });
  };

  const imageMediaUrls = media
    ?.filter(m => m.media_type === 'image')
    .map(m => m.media_url) || [];

  const videoMediaUrls = media
    ?.filter(m => m.media_type === 'video')
    .map(m => m.media_url) || [];

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
            onPublish={handlePublish}
          />
        </div>

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

        <MediaSection
          mediaUrls={imageMediaUrls}
          onDelete={handleDelete}
          exerciseName={exercise.name}
          type="image"
        />

        <MediaSection
          mediaUrls={videoMediaUrls}
          onDelete={handleDelete}
          exerciseName={exercise.name}
          type="video"
        />
      </div>
    </Card>
  );
};