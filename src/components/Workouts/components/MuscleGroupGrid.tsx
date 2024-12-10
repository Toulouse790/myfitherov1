import { useState, useEffect } from "react";
import { muscleGroups } from "../workoutConstants";
import { useExerciseFetching } from "@/hooks/use-exercise-fetching";
import { MuscleGroupCard } from "./MuscleGroupCard";

interface MuscleGroupGridProps {
  searchQuery: string;
  onMuscleGroupClick: (muscleId: string) => void;
}

export const MuscleGroupGrid = ({ 
  searchQuery, 
  onMuscleGroupClick 
}: MuscleGroupGridProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { exerciseCounts, fetchExercises } = useExerciseFetching();

  useEffect(() => {
    fetchExercises();
  }, []);

  const handleClick = (muscleId: string) => {
    console.log('Muscle group clicked:', muscleId);
    setSelectedId(muscleId);
    onMuscleGroupClick(muscleId);
  };

  const getMuscleGroupCount = (muscleId: string): number => {
    return exerciseCounts[muscleId.toLowerCase()] || 0;
  };

  const filteredMuscleGroups = muscleGroups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
      {filteredMuscleGroups.map((muscle) => (
        <MuscleGroupCard
          key={muscle.id}
          id={muscle.id}
          name={muscle.name}
          isSelected={selectedId === muscle.id}
          exerciseCount={getMuscleGroupCount(muscle.id)}
          onClick={() => handleClick(muscle.id)}
        />
      ))}
    </div>
  );
};