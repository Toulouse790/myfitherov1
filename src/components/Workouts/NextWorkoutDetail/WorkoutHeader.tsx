import { Timer, Dumbbell, Flame } from "lucide-react";

export const WorkoutHeader = () => {
  return (
    <div className="text-center space-y-4">
      <h1 className="text-3xl font-bold">Dos, Biceps & Épaules</h1>
      <div className="flex justify-center gap-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Timer className="w-5 h-5" />
          <span>61 mins</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Dumbbell className="w-5 h-5" />
          <span>8 exercices</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Flame className="w-5 h-5" />
          <span>~350 kcal</span>
        </div>
      </div>
    </div>
  );
};