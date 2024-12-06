import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MediaList } from "./MediaList";
import { muscleGroups } from "../Workouts/workoutConstants";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { useQuery } from "@tanstack/react-query";

export const MediaManager = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedGroup] = useState<string>(muscleGroups[0]?.id || "");
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>([]);

  const { data: exercises = [], isError, isLoading, refetch } = useQuery({
    queryKey: ['exercises'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercises')
        .select('*');

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        console.log('No exercises found in database');
        return [];
      }

      return data.map(exercise => ({
        id: exercise.id,
        name: exercise.name,
        muscleGroup: exercise.muscle_group,
        difficulty: exercise.difficulty || [],
        description: "Description de l'exercice",
        equipment: "Équipement standard",
        location: ["gym"],
        instructions: ["Instruction 1"],
        targetMuscles: [exercise.muscle_group],
        objectives: ["muscle_gain"],
        sets: {
          beginner: 3,
          intermediate: 4,
          advanced: 5
        },
        reps: {
          beginner: 10,
          intermediate: 12,
          advanced: 15
        },
        restTime: {
          beginner: 60,
          intermediate: 45,
          advanced: 30
        },
        calories: 100
      })) as Exercise[];
    }
  });

  if (isError) {
    toast({
      title: "Erreur",
      description: "Impossible de charger les exercices",
      variant: "destructive",
    });
  }

  if (isLoading) {
    return <div>Chargement des exercices...</div>;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedExercise(exercises.find(e => e.name === event.target.dataset.exerciseName)?.name || null);
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
      await refetch();
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
      
      await refetch();
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

      <MediaList
        exercises={exercises}
        onFileChange={handleFileChange}
        onUpload={handleUpload}
        selectedFile={selectedFile}
        onDifficultyChange={handleDifficultyChange}
        selectedDifficulties={selectedDifficulties}
      />
    </div>
  );
};
