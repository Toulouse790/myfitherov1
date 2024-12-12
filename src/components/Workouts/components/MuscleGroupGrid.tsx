import { muscleGroups } from "../workoutConstants";
import { MuscleGroupCard } from "./MuscleGroupCard";

interface MuscleGroupGridProps {
  onSelect: (muscleId: string) => void;
}

export const MuscleGroupGrid = ({ onSelect }: MuscleGroupGridProps) => {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {muscleGroups.map((muscle) => (
        <MuscleGroupCard
          key={muscle.id}
          id={muscle.id}
          name={muscle.name}
          isSelected={false}
          exerciseCount={muscle.totalExercises}
          onClick={() => onSelect(muscle.id)}
        />
      ))}
    </div>
  );
};