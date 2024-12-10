interface WorkoutStatsProps {
  duration: number;
  totalWeight: number;
  totalCalories: number;
}

export const WorkoutStats = ({ duration, totalWeight, totalCalories }: WorkoutStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center">
        <div className="text-2xl font-bold">{duration}</div>
        <div className="text-sm text-muted-foreground">Minutes</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{totalWeight}</div>
        <div className="text-sm text-muted-foreground">kg soulevés</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold">{totalCalories}</div>
        <div className="text-sm text-muted-foreground">Calories</div>
      </div>
    </div>
  );
};