
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Activity, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface SubScore {
  name: string;
  value: number;
  icon: JSX.Element;
}

export const ForceScoreCard = () => {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ['force-score', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data: trainingStats } = await supabase
        .from('training_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      const { data: progression } = await supabase
        .from('user_progression')
        .select('*')
        .eq('user_id', user.id)
        .single();

      return {
        trainingStats,
        progression
      };
    }
  });

  const calculateForceScore = (): number => {
    if (!stats?.progression) return 0;
    const baseScore = stats.progression.total_points || 0;
    return Math.min(100, Math.round(baseScore / 10));
  };

  const getSubScores = (): SubScore[] => {
    if (!stats?.trainingStats) return [];
    
    const weightLifted = stats.trainingStats.reduce((sum, stat) => sum + (stat.total_weight_lifted || 0), 0);
    const sessionsCount = stats.trainingStats.length;
    const avgDuration = stats.trainingStats.reduce((sum, stat) => sum + (stat.session_duration_minutes || 0), 0) / sessionsCount;

    return [
      {
        name: "Force",
        value: Math.min(100, Math.round((weightLifted / 1000) * 10)),
        icon: <Trophy className="w-4 h-4 text-blue-500" />
      },
      {
        name: "Régularité",
        value: Math.min(100, sessionsCount * 10),
        icon: <Activity className="w-4 h-4 text-green-500" />
      },
      {
        name: "Intensité",
        value: Math.min(100, Math.round(avgDuration * 1.5)),
        icon: <TrendingUp className="w-4 h-4 text-orange-500" />
      },
      {
        name: "Progression",
        value: Math.min(100, (stats.progression?.current_level || 1) * 10),
        icon: <Target className="w-4 h-4 text-purple-500" />
      }
    ];
  };

  const forceScore = calculateForceScore();
  const subScores = getSubScores();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Trophy className="h-5 w-5 text-primary" />
          Score de force
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold mb-2">{forceScore}</div>
            <Progress value={forceScore} className="w-full h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {subScores.map((score, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center gap-2">
                  {score.icon}
                  <span className="text-sm font-medium">{score.name}</span>
                </div>
                <Progress value={score.value} className="h-2" />
                <div className="text-xs text-right">{score.value}/100</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
