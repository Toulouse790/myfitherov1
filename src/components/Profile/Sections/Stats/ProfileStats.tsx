
import { Trophy, Target, Dumbbell, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/types/user";
import { Progress } from "@/components/ui/progress";

interface ProfileStatsProps {
  stats: UserProfile['stats'];
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => {
  // Calculate progress to next level (simplified)
  const nextLevelPoints = (stats.level + 1) * 100;
  const currentProgress = (stats.points / nextLevelPoints) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">Niveau {stats.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">{stats.points} / {nextLevelPoints} points</span>
        </div>
        
        <Progress value={currentProgress} className="h-2 mb-6" />
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Dumbbell className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.workoutsCompleted}</p>
            <p className="text-sm text-muted-foreground">Entraînements</p>
          </div>
          
          <div className="text-center">
            <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.points}</p>
            <p className="text-sm text-muted-foreground">Points</p>
          </div>
          
          <div className="text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{stats.streakDays}</p>
            <p className="text-sm text-muted-foreground">Jours consécutifs</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
