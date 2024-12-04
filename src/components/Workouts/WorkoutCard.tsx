import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  calories: number;
}

interface WorkoutCardProps {
  workout: {
    title: string;
    muscleGroup: string;
    exercises: Exercise[];
    totalCalories: number;
  };
}

export const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  return (
    <Card 
      className="bg-[#2A2F3F] p-3"
    >
      <div className="space-y-2">
        <div className="rounded-full bg-[#1E2330] w-10 h-10 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
        <h3 className="text-white font-medium text-sm sm:text-base">{workout.title}</h3>
        <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">
          {workout.muscleGroup} • {workout.exercises.length} exercices • {workout.totalCalories} kcal
        </p>
      </div>
    </Card>
  );
};