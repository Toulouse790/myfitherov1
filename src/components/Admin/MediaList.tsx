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
    console.log('Comparing:', {
      exerciseMuscleGroup: exercise.muscleGroup,
      selectedGroup: selectedGroup,
      matches: exercise.muscleGroup === selectedGroup
    });
    return exercise.muscleGroup === selectedGroup;
  });
  
  console.log('MediaList - Filtered exercises:', filteredExercises);

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