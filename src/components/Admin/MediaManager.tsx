import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, Video, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { exercises } from "../Workouts/exerciseLibrary";
import { supabase } from "@/integrations/supabase/client";

export const MediaManager = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedExercise, setSelectedExercise] = useState<string>(exercises[0]?.name || "");
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
    if (!selectedFile || !selectedExercise) return;

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
          exercise_name: selectedExercise,
          media_type: mediaType,
          media_url: publicUrl
        });

      if (dbError) throw dbError;

      toast({
        title: "Média téléchargé avec succès",
        description: `Le média a été ajouté à l'exercice ${selectedExercise}`,
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

  const MediaUploadSection = ({ type }: { type: "image" | "video" }) => (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Input
          type="file"
          accept={type === "image" ? "image/*" : "video/*"}
          onChange={handleFileChange}
          className="flex-1"
        />
        <Button onClick={handleUpload} disabled={!selectedFile}>
          <Upload className="mr-2 h-4 w-4" />
          Uploader
        </Button>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {exerciseMedia[selectedExercise]?.[type === "image" ? "images" : "videos"]?.map((mediaUrl, index) => (
          <div 
            key={index}
            className="relative group"
          >
            <div className={`${
              type === "image" ? "aspect-square" : "aspect-video"
            } bg-gray-100 rounded-lg overflow-hidden`}>
              {type === "image" ? (
                <img 
                  src={mediaUrl} 
                  alt={`${type} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video 
                  src={mediaUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDelete(mediaUrl, selectedExercise, type)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestionnaire de médias</h2>
      </div>

      <Tabs defaultValue={exercises[0]?.name} className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          {exercises.map((exercise) => (
            <TabsTrigger
              key={exercise.id}
              value={exercise.name}
              onClick={() => setSelectedExercise(exercise.name)}
            >
              {exercise.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {exercises.map((exercise) => (
          <TabsContent key={exercise.id} value={exercise.name} className="space-y-6">
            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Image className="mr-2 h-4 w-4" />
                Images - {exercise.name}
              </h3>
              <MediaUploadSection type="image" />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Video className="mr-2 h-4 w-4" />
                Vidéos - {exercise.name}
              </h3>
              <MediaUploadSection type="video" />
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};