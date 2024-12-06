import { ExerciseRow } from "./ExerciseRow";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseMedia } from "@/types/exercise-media";

interface MediaListProps {
  exercises: Exercise[];
  selectedGroup: string;
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

  if (!exercises || exercises.length === 0) {
    return <div className="text-center p-4">Aucun exercice disponible</div>;
  }

  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
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
      ))}
    </div>
  );
};