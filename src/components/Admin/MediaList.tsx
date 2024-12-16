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
    const difficultyMatch = selectedDifficulties.length === 0 || 
           (Array.isArray(exercise.difficulty) && 
           exercise.difficulty.some(diff => selectedDifficulties.includes(diff)));

    const hasLocation = !exercise.location || (Array.isArray(exercise.location) && exercise.location.length > 0);

    return difficultyMatch && hasLocation;
  });

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
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
              location: exercise.location,
              image_url: exercise.image_url,
              video_url: exercise.video_url,
              est_publié: exercise.est_publié
            }}
            onUpdate={onUpload}
          />
        </TabsContent>
      ))}
    </div>
  );
};