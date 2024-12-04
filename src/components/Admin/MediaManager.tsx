import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { MuscleGroupList } from "./MuscleGroupList";
import { MediaList } from "./MediaList";
import { muscleGroups } from "../Workouts/workoutConstants";

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
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  useEffect(() => {
    fetchExercises();
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
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Erreur lors du téléchargement",
        description: "Une erreur est survenue lors du téléchargement du fichier.",
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
        
        <MediaList
          exercises={exercises}
          selectedGroup={selectedGroup}
          onFileChange={handleFileChange}
          onUpload={handleUpload}
          selectedFile={selectedFile}
          onDifficultyChange={handleDifficultyChange}
          selectedDifficulties={selectedDifficulties}
        />
      </Tabs>
    </div>
  );
};