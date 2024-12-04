import { ExerciseRow } from "./ExerciseRow";
import { Exercise } from "../Workouts/types/exercise";

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
  const filteredExercises = exercises.filter(
    exercise => exercise.muscle_group.toLowerCase() === selectedGroup.toLowerCase()
  );

  return (
    <div className="space-y-4">
      {filteredExercises.map((exercise) => (
        <ExerciseRow
          key={exercise.id}
          exercise={exercise}
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