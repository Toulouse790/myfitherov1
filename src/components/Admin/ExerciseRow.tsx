import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Image, Video, Upload } from "lucide-react";
import { UploadForm } from "./UploadForm";
import { DifficultyBadges } from "./DifficultyBadges";
import { useState } from "react";
import { ExerciseMedia } from "@/types/exercise-media";
import { MediaGrid } from "./MediaGrid";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  media = []
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
            <Button
              variant="default"
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={handlePublish}
            >
              <Upload className="mr-2 h-4 w-4" />
              Publier
            </Button>
          </div>
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

        {imageMediaUrls.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Images</h4>
            <MediaGrid
              mediaUrls={imageMediaUrls}
              onDelete={handleDelete}
              exerciseName={exercise.name}
              type="image"
            />
          </div>
        )}

        {videoMediaUrls.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Vidéos</h4>
            <MediaGrid
              mediaUrls={videoMediaUrls}
              onDelete={handleDelete}
              exerciseName={exercise.name}
              type="video"
            />
          </div>
        )}
      </div>
    </Card>
  );
};