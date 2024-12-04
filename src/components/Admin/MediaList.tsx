import { ExerciseRow } from "./ExerciseRow";
import { Exercise } from "@/components/Workouts/exercises/types/exercise";

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
  selectedGroup,
  onFileChange,
  onUpload,
  selectedFile,
  onDifficultyChange,
  selectedDifficulties,
}: MediaListProps) => {
  console.log('MediaList - All exercises:', exercises);
  console.log('MediaList - Selected group:', selectedGroup);
  
  const filteredExercises = exercises.filter(exercise => {
    const match = exercise.muscleGroup.toLowerCase() === selectedGroup.toLowerCase();
    console.log('Comparing:', {
      exerciseMuscleGroup: exercise.muscleGroup.toLowerCase(),
      selectedGroup: selectedGroup.toLowerCase(),
      matches: match
    });
    return match;
  });
  
  console.log('MediaList - Filtered exercises:', filteredExercises);

  if (exercises.length === 0) {
    return <div>Aucun exercice disponible</div>;
  }

  if (filteredExercises.length === 0) {
    return <div>Aucun exercice trouvé pour ce groupe musculaire</div>;
  }

  return (
    <div className="space-y-4">
      {filteredExercises.map((exercise) => (
        <ExerciseRow
          key={exercise.id}
          exercise={{
            id: exercise.id,
            name: exercise.name,
            difficulty: Array.isArray(exercise.difficulty) 
              ? exercise.difficulty 
              : [exercise.difficulty]
          }}
          onFileChange={onFileChange}
          onUpload={onUpload}
          selectedFile={selectedFile}
          onDifficultyChange={onDifficultyChange}
          selectedDifficulties={selectedDifficulties}
        />
      ))}
    </div>
  );
};