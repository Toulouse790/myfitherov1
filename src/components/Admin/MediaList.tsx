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
  
  const getMuscleGroupForFilter = (group: string): string => {
    const muscleGroupMap: { [key: string]: string } = {
      chest: 'poitrine',
      back: 'dos',
      legs: 'jambes',
      shoulders: 'épaules',
      biceps: 'biceps',
      triceps: 'triceps',
      abs: 'abdominaux'
    };
    return muscleGroupMap[group] || group;
  };

  const filteredExercises = exercises.filter(exercise => {
    const muscleGroupToMatch = getMuscleGroupForFilter(selectedGroup);
    const match = exercise.muscleGroup.toLowerCase() === muscleGroupToMatch.toLowerCase();
    console.log('Comparing:', {
      exerciseMuscleGroup: exercise.muscleGroup.toLowerCase(),
      selectedGroup: muscleGroupToMatch.toLowerCase(),
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