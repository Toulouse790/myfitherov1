import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaSection } from "../MediaSection";
import { MediaPreview } from "../MediaPreview";
import { MediaButtons } from "../MediaButtons";
import { MediaManagerProps } from "../types/media";

export const MediaManager = ({ exercise, media, onUpload }: MediaManagerProps) => {
  const [showPreview, setShowPreview] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { toast } = useToast();

  const handleDelete = async (url: string, exerciseName: string, type: 'image' | 'video') => {
    try {
      console.log("Deleting media:", { url, exerciseName, type });
      
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      const { error: storageError } = await supabase
        .storage
        .from('exercise-media')
        .remove([fileName]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('exercise_media')
        .delete()
        .eq('media_url', url);

      if (dbError) throw dbError;

      toast({
        title: "Média supprimé",
        description: `${type === 'image' ? 'L\'image' : 'La vidéo'} a été supprimée`,
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

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    try {
      const { error } = await supabase
        .from('unified_exercises')
        .update({ is_published: !exercise.is_published })
        .eq('id', exercise.id);

      if (error) throw error;

      toast({
        title: "Statut mis à jour",
        description: `L'exercice a été ${exercise.is_published ? 'dépublié' : 'publié'}`,
      });

      onUpload();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const imageMediaUrls = media
    ?.filter(m => m.media_type === 'image')
    .map(m => m.media_url) || [];

  const videoMediaUrls = media
    ?.filter(m => m.media_type === 'video')
    .map(m => m.media_url) || [];

  const allMediaUrls = [...imageMediaUrls.map(url => ({ type: 'image' as const, url })), 
                       ...videoMediaUrls.map(url => ({ type: 'video' as const, url }))];
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <MediaButtons
          onImageClick={() => {}}
          onVideoClick={() => {}}
          isPublished={exercise.is_published}
          isPublishing={isPublishing}
          onPublishToggle={handlePublishToggle}
        />
      </div>

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

      <MediaPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onConfirm={() => {}}
        mediaUrls={allMediaUrls}
        exerciseName={exercise.name}
      />
    </div>
  );
};