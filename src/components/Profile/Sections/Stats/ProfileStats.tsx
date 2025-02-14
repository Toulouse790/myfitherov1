
import { Trophy, Target, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/types/user";

interface ProfileStatsProps {
  stats: UserProfile['stats'];
}

export const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card className="p-4 text-center">
        <Trophy className="w-6 h-6 mx-auto mb-2 text-primary" />
        <p className="text-2xl font-bold">{stats.level}</p>
        <p className="text-sm text-muted-foreground">Niveau</p>
      </Card>
      <Card className="p-4 text-center">
        <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
        <p className="text-2xl font-bold">{stats.points}</p>
        <p className="text-sm text-muted-foreground">Points</p>
      </Card>
      <Card className="p-4 text-center">
        <Calendar className="w-6 h-6 mx-auto mb-2 text-primary" />
        <p className="text-2xl font-bold">{stats.streakDays}</p>
        <p className="text-sm text-muted-foreground">Jours consécutifs</p>
      </Card>
    </div>
  );
};
