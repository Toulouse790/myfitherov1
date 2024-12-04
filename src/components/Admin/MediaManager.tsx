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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  difficulty: string[];
}

export const MediaManager = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>(muscleGroups[0]?.name || "");
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [exerciseMedia, setExerciseMedia] = useState<{[key: string]: {images: string[], videos: string[]}}>({});
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  const difficulties = ["beginner", "intermediate", "advanced", "expert"];

  useEffect(() => {
    fetchExercises();
    fetchExerciseMedia();
  }, []);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select('*');

      if (error) throw error;
      setExercises(data);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les exercices",
        variant: "destructive",
      });
    }
  };

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

      const exercise = exercises.find(e => e.name === selectedExercise);
      
      const { error: dbError } = await supabase
        .from('exercise_media')
        .insert({
          exercise_name: selectedExercise,
          media_type: mediaType,
          media_url: publicUrl,
          exercise_id: exercise?.id
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

  const handleDifficultyChange = async (difficulty: string) => {
    if (!selectedExercise) return;

    const exercise = exercises.find(e => e.name === selectedExercise);
    if (!exercise) return;

    const newDifficulties = selectedDifficulties.includes(difficulty)
      ? selectedDifficulties.filter(d => d !== difficulty)
      : [...selectedDifficulties, difficulty];

    setSelectedDifficulties(newDifficulties);

    try {
      const { error } = await supabase
        .from('exercises')
        .update({ difficulty: newDifficulties })
        .eq('id', exercise.id);

      if (error) throw error;

      toast({
        title: "Niveaux de difficulté mis à jour",
        description: `Les niveaux de difficulté pour ${selectedExercise} ont été mis à jour`,
      });

      fetchExercises();
    } catch (error) {
      console.error('Error updating difficulties:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les niveaux de difficulté",
        variant: "destructive",
      });
    }
  };

  const filteredExercises = exercises.filter(
    exercise => exercise.muscle_group.toLowerCase() === selectedGroup.toLowerCase()
  );

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Exercices - {selectedGroup}</h3>
            <div className="space-y-2">
              {filteredExercises.map((exercise) => (
                <Card
                  key={exercise.id}
                  className={`p-4 cursor-pointer hover:bg-accent ${
                    selectedExercise === exercise.name ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => {
                    setSelectedExercise(exercise.name);
                    setSelectedDifficulties(exercise.difficulty);
                  }}
                >
                  <h4 className="font-medium">{exercise.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {exercise.difficulty.length} niveau(x) de difficulté
                  </p>
                </Card>
              ))}
            </div>
          </div>

          {selectedExercise && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Niveaux de difficulté - {selectedExercise}</h3>
                <div className="space-y-2">
                  {difficulties.map((difficulty) => (
                    <div key={difficulty} className="flex items-center space-x-2">
                      <Checkbox
                        id={difficulty}
                        checked={selectedDifficulties.includes(difficulty)}
                        onCheckedChange={() => handleDifficultyChange(difficulty)}
                      />
                      <Label htmlFor={difficulty} className="capitalize">
                        {difficulty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Image className="mr-2 h-4 w-4" />
                  Images - {selectedExercise}
                </h3>
                <UploadForm
                  type="image"
                  onFileChange={handleFileChange}
                  onUpload={handleUpload}
                  selectedFile={selectedFile}
                />
                <MediaGrid
                  mediaUrls={exerciseMedia[selectedExercise]?.images || []}
                  onDelete={handleDelete}
                  exerciseName={selectedExercise}
                  type="image"
                />
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Video className="mr-2 h-4 w-4" />
                  Vidéos - {selectedExercise}
                </h3>
                <UploadForm
                  type="video"
                  onFileChange={handleFileChange}
                  onUpload={handleUpload}
                  selectedFile={selectedFile}
                />
                <MediaGrid
                  mediaUrls={exerciseMedia[selectedExercise]?.videos || []}
                  onDelete={handleDelete}
                  exerciseName={selectedExercise}
                  type="video"
                />
              </Card>
            </div>
          )}
        </div>
      </Tabs>
    </div>
  );
};