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
    // Si aucune difficulté n'est sélectionnée, on montre tous les exercices
    const difficultyMatch = selectedDifficulties.length === 0 || 
           (Array.isArray(exercise.difficulty) && 
           exercise.difficulty.some(diff => selectedDifficulties.includes(diff)));

    // Si aucun lieu n'est défini pour l'exercice, on ne le montre pas
    const hasLocation = Array.isArray(exercise.location) && exercise.location.length > 0;

    console.log('Filtering exercise:', {
      name: exercise.name,
      difficulty: exercise.difficulty,
      location: exercise.location,
      difficultyMatch,
      hasLocation
    });

    return difficultyMatch && hasLocation;
  });

  console.log('Filtered exercises:', {
    total: exercises.length,
    filtered: filteredExercises.length,
    selectedDifficulties,
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
              location: exercise.location,
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