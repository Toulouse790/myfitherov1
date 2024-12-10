import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CardioExerciseSelectorProps {
  exercises: any[];
  selectedExercise: any;
  onExerciseChange: (exercise: any) => void;
}

export const CardioExerciseSelector = ({
  exercises,
  selectedExercise,
  onExerciseChange
}: CardioExerciseSelectorProps) => {
  return (
    <div className="space-y-4">
      <Select 
        onValueChange={(id) => {
          const exercise = exercises.find(ex => ex.id === id);
          onExerciseChange(exercise);
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Sélectionner un exercice" />
        </SelectTrigger>
        <SelectContent>
          {exercises.map((exercise) => (
            <SelectItem key={exercise.id} value={exercise.id}>
              {exercise.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};