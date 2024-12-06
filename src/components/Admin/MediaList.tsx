import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { muscleGroups } from "../Workouts/workoutConstants";
import { ExerciseRow } from "./ExerciseRow";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExerciseMedia } from "@/types/exercise-media";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";

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

  // Group exercises by muscle group
  const exercisesByGroup = exercises.reduce((acc, exercise) => {
    const group = exercise.muscleGroup;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(exercise);
    return acc;
  }, {} as { [key: string]: Exercise[] });

  return (
    <div className="space-y-8">
      {Object.entries(exercisesByGroup).map(([group, groupExercises]) => (
        <div key={group} className="space-y-4">
          <h3 className="text-xl font-semibold mb-4 text-primary">
            {translateMuscleGroup(group)}
          </h3>
          <div className="space-y-4">
            {groupExercises.map((exercise) => (
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
        </div>
      ))}
    </div>
  );
};