import { TabsContent } from "@/components/ui/tabs";
import { ExerciseRow } from "./ExerciseRow";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseMedia } from "@/types/exercise-media";

interface MediaListProps {
  exercises: Exercise[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpload: () => void;
  selectedFile: File | null;
  onDifficultyChange: (difficulty: string) => void;
  selectedDifficulties: string[];
}

export const MediaList = ({
  exercises,
  onFileChange,
  onUpload,
  selectedFile,
  selectedDifficulties,
}: MediaListProps) => {
  const { data: exerciseMedia } = useQuery({
    queryKey: ['exerciseMedia'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_media')
        .select('*');
      
      if (error) throw error;
      return data as ExerciseMedia[];
    }
  });

  const getMediaForExercise = (exerciseId: string) => {
    return exerciseMedia?.filter(media => media.exercise_id === exerciseId) || [];
  };

  // Filtrer les exercices en fonction des difficultés sélectionnées
  const filteredExercises = exercises.filter(exercise => {
    if (selectedDifficulties.length === 0) return true;
    return exercise.difficulty.some(diff => selectedDifficulties.includes(diff));
  });

  return (
    <div className="space-y-4">
      {filteredExercises.map((exercise) => (
        <TabsContent key={exercise.id} value={exercise.muscleGroup}>
          <ExerciseRow
            key={exercise.id}
            exercise={{
              id: exercise.id,
              name: exercise.name,
              muscle_group: exercise.muscleGroup,
              difficulty: Array.isArray(exercise.difficulty) 
                ? exercise.difficulty 
                : [exercise.difficulty]
            }}
            onUpload={onUpload}
            selectedFile={selectedFile}
            media={getMediaForExercise(exercise.id)}
          />
        </TabsContent>
      ))}
    </div>
  );
};