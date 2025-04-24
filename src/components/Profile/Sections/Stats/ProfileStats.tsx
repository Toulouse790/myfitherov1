
import { Trophy, Target, Dumbbell, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { UserProfile } from "@/types/user";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "./StatCard";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileStatsProps {
  stats: UserProfile['stats'];
  detailed?: boolean;
}

export const ProfileStats = ({ stats, detailed = false }: ProfileStatsProps) => {
  const { t } = useLanguage();
  const nextLevelPoints = (stats.level + 1) * 100;
  const currentProgress = (stats.points / nextLevelPoints) * 100;

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">{t("profile.stats.title")}</h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="font-medium">{t("profile.stats.level")} {stats.level}</span>
          </div>
          <span className="text-sm text-muted-foreground">{stats.points} / {nextLevelPoints} {t("profile.stats.points")}</span>
        </div>
        
        <Progress value={currentProgress} className="h-2 mb-6" />
        
        <div className="grid grid-cols-3 gap-4">
          <StatCard 
            icon={<Dumbbell />}
            value={stats.workoutsCompleted}
            label={t("profile.stats.workoutsCompleted")}
          />
          
          <StatCard 
            icon={<Target />}
            value={stats.points}
            label={t("profile.stats.points")}
          />
          
          <StatCard 
            icon={<Calendar />}
            value={stats.streakDays}
            label={t("profile.stats.streakDays")}
          />
        </div>

        {detailed && (
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-md font-medium mb-4">{t("profile.stats.detailedTitle")}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{t("profile.stats.totalWorkoutMinutes")}</p>
                <p className="text-xl font-bold">{stats.totalWorkoutMinutes} min</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{t("profile.stats.averageWorkoutMinutes")}</p>
                <p className="text-xl font-bold">
                  {stats.workoutsCompleted > 0 ? Math.round(stats.totalWorkoutMinutes / stats.workoutsCompleted) : 0} min
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
