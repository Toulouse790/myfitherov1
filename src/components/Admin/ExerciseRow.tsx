import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ExerciseMedia } from "@/types/exercise-media";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaButtons } from "./MediaButtons";
import { ExerciseHeader } from "./ExerciseHeader";
import { MediaSection } from "./MediaSection";
import { UploadForm } from "./UploadForm";
import { MediaPreview } from "./MediaPreview";

interface ExerciseRowProps {
  exercise: {
    id: string;
    name: string;
    muscle_group: string;
    difficulty: string[];
    location?: string[];
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
  const [showPreview, setShowPreview] = useState(false);
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

  const handlePublish = async () => {
    console.log("Opening preview dialog");
    setShowPreview(true);
  };

  const handleConfirmPublish = async () => {
    try {
      console.log("Publishing exercise:", exercise.id);
      const { error } = await supabase
        .from('exercises')
        .update({ is_published: true })
        .eq('id', exercise.id);

      if (error) throw error;

      toast({
        title: "Publication réussie",
        description: "L'exercice a été publié avec succès",
      });

      setShowPreview(false);
    } catch (error) {
      console.error('Error publishing exercise:', error);
      toast({
        title: "Erreur",
        description: "Impossible de publier l'exercice",
        variant: "destructive",
      });
    }
  };

  const imageMediaUrls = media
    ?.filter(m => m.media_type === 'image')
    .map(m => ({ type: 'image' as const, url: m.media_url })) || [];

  const videoMediaUrls = media
    ?.filter(m => m.media_type === 'video')
    .map(m => ({ type: 'video' as const, url: m.media_url })) || [];

  const allMediaUrls = [...imageMediaUrls, ...videoMediaUrls];

  console.log("Media URLs:", allMediaUrls);
  console.log("Show preview state:", showPreview);

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
            hasMedia={allMediaUrls.length > 0}
          />
        </div>

        {(showImageUpload || showVideoUpload) && (
          <div className="mt-4">
            <UploadForm
              exercise_id={exercise.id}
              exercise_name={exercise.name}
              type={showImageUpload ? "image" : "video"}
              onUpload={onUpload}
              selectedFile={selectedFile}
              difficulty={exercise.difficulty}
              location={exercise.location || []}
            />
          </div>
        )}

        <MediaSection
          mediaUrls={imageMediaUrls.map(m => m.url)}
          onDelete={handleDelete}
          exerciseName={exercise.name}
          type="image"
        />

        <MediaSection
          mediaUrls={videoMediaUrls.map(m => m.url)}
          onDelete={handleDelete}
          exerciseName={exercise.name}
          type="video"
        />

        <MediaPreview
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onConfirm={handleConfirmPublish}
          mediaUrls={allMediaUrls}
          exerciseName={exercise.name}
        />
      </div>
    </Card>
  );
};