
import { Star, Trophy, Dumbbell, Utensils, Moon } from "lucide-react";
import { useUserProgression } from "@/hooks/use-user-progression";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ProgressionSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-full" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
      <Skeleton className="h-24" />
    </div>
  </div>
);

const CategoryCard = ({ 
  icon: Icon, 
  title, 
  points, 
  multiplier 
}: { 
  icon: React.ElementType;
  title: string;
  points: number;
  multiplier: number;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Card className="p-4 transition-all hover:scale-105 cursor-help">
          <div className="flex items-center space-x-3">
            <Icon className="w-5 h-5 text-primary" />
            <div className="flex-1">
              <h3 className="text-sm font-medium">{title}</h3>
              <p className="text-xs text-muted-foreground">
                {points} points {multiplier > 1 && `(×${multiplier})`}
              </p>
            </div>
          </div>
        </Card>
      </TooltipTrigger>
      <TooltipContent>
        <p>Multiplicateur actuel: ×{multiplier}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export function UserProgressionWidget() {
  const { 
    progression, 
    isLoading, 
    levelProgress,
    getRequiredPointsForLevel
  } = useUserProgression();

  if (isLoading || !progression) return <ProgressionSkeleton />;

  const nextLevel = progression.current_level + 1;
  const pointsToNext = getRequiredPointsForLevel(nextLevel) - progression.total_points;

  return (
    <div className="space-y-6 p-4 animate-fade-in">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold">Niveau {progression.current_level}</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="text-lg font-medium">{progression.total_points} points</span>
          </div>
        </div>

        <div className="space-y-1">
          <Progress value={levelProgress} className="h-2 transition-all" />
          <p className="text-xs text-muted-foreground text-right">
            {pointsToNext} points jusqu'au niveau {nextLevel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CategoryCard
          icon={Dumbbell}
          title="Fitness"
          points={progression.workout_points}
          multiplier={progression.workout_multiplier}
        />
        <CategoryCard
          icon={Utensils}
          title="Nutrition"
          points={progression.nutrition_points}
          multiplier={progression.nutrition_multiplier}
        />
        <CategoryCard
          icon={Moon}
          title="Sommeil"
          points={progression.sleep_points}
          multiplier={progression.sleep_multiplier}
        />
      </div>
    </div>
  );
}
