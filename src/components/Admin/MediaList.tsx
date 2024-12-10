import { TabsContent } from "@/components/ui/tabs";
import { ExerciseRow } from "./ExerciseRow";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";
import { useQuery } from "@tanstack/react-query";

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
  onDifficultyChange,
}: MediaListProps) => {
  const filteredExercises = exercises.filter(exercise => {
    if (selectedDifficulties.length === 0) return true;
    return Array.isArray(exercise.difficulty) && 
           exercise.difficulty.some(diff => selectedDifficulties.includes(diff));
  });

  return (
    <div className="space-y-4">
      {filteredExercises.map((exercise) => (
        <TabsContent key={exercise.id} value={exercise.muscleGroup}>
          <ExerciseRow
            exercise={{
              id: exercise.id,
              name: exercise.name,
              muscle_group: exercise.muscleGroup,
              difficulty: Array.isArray(exercise.difficulty) 
                ? exercise.difficulty 
                : [exercise.difficulty],
              image_url: exercise.image_url,
              video_url: exercise.video_url,
              is_published: exercise.is_published
            }}
            onUpdate={onUpload}
          />
        </TabsContent>
      ))}
    </div>
  );
};