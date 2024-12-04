import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Image, Video } from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { MuscleGroupList } from "./MuscleGroupList";
import { MediaGrid } from "./MediaGrid";
import { UploadForm } from "./UploadForm";
import { muscleGroups } from "../Workouts/workoutConstants";

export const MediaManager = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>(muscleGroups[0]?.name || "");
  const [exerciseMedia, setExerciseMedia] = useState<{[key: string]: {images: string[], videos: string[]}}>({});

  useEffect(() => {
    fetchExerciseMedia();
  }, []);

  const fetchExerciseMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('exercise_media')
        .select('*');

      if (error) throw error;

      const mediaMap = data.reduce((acc, item) => ({
        ...acc,
        [item.exercise_name]: {
          images: item.media_type === 'image' 
            ? [...(acc[item.exercise_name]?.images || []), item.media_url]
            : (acc[item.exercise_name]?.images || []),
          videos: item.media_type === 'video'
            ? [...(acc[item.exercise_name]?.videos || []), item.media_url]
            : (acc[item.exercise_name]?.videos || [])
        }
      }), {});

      setExerciseMedia(mediaMap);
    } catch (error) {
      console.error('Error fetching exercise media:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les médias des exercices",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedGroup) return;

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const mediaType = selectedFile.type.startsWith('image/') ? 'image' : 'video';

      const { error: uploadError } = await supabase.storage
        .from('exercise-media')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('exercise-media')
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('exercise_media')
        .insert({
          exercise_name: selectedGroup,
          media_type: mediaType,
          media_url: publicUrl
        });

      if (dbError) throw dbError;

      toast({
        title: "Média téléchargé avec succès",
        description: `Le média a été ajouté à l'exercice ${selectedGroup}`,
      });

      setSelectedFile(null);
      fetchExerciseMedia();
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Erreur lors du téléchargement",
        description: "Une erreur est survenue lors du téléchargement du fichier.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (mediaUrl: string, exerciseName: string, mediaType: 'image' | 'video') => {
    try {
      const { error } = await supabase
        .from('exercise_media')
        .delete()
        .eq('media_url', mediaUrl)
        .eq('exercise_name', exerciseName)
        .eq('media_type', mediaType);

      if (error) throw error;

      toast({
        title: "Média supprimé",
        description: `Le média a été supprimé de l'exercice ${exerciseName}`,
      });

      fetchExerciseMedia();
    } catch (error) {
      console.error('Error deleting media:', error);
      toast({
        title: "Erreur lors de la suppression",
        description: "Une erreur est survenue lors de la suppression du fichier.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionnaire de médias</h2>
      </div>

      <Tabs defaultValue={muscleGroups[0]?.name} className="space-y-6">
        <MuscleGroupList
          selectedGroup={selectedGroup}
          onGroupSelect={setSelectedGroup}
        />

        {muscleGroups.map((group) => (
          <TabsContent key={group.id} value={group.name} className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Image className="mr-2 h-4 w-4" />
                Images - {group.name}
              </h3>
              <UploadForm
                type="image"
                onFileChange={handleFileChange}
                onUpload={handleUpload}
                selectedFile={selectedFile}
              />
              <MediaGrid
                mediaUrls={exerciseMedia[group.name]?.images || []}
                onDelete={handleDelete}
                exerciseName={group.name}
                type="image"
              />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Video className="mr-2 h-4 w-4" />
                Vidéos - {group.name}
              </h3>
              <UploadForm
                type="video"
                onFileChange={handleFileChange}
                onUpload={handleUpload}
                selectedFile={selectedFile}
              />
              <MediaGrid
                mediaUrls={exerciseMedia[group.name]?.videos || []}
                onDelete={handleDelete}
                exerciseName={group.name}
                type="video"
              />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};