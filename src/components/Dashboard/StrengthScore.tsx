import { Card } from "@/components/ui/card";
import { Target, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ScoreCircle } from "./StrengthScore/ScoreCircle";
import { LevelInfo } from "./StrengthScore/LevelInfo";
import { ProgressInfo } from "./StrengthScore/ProgressInfo";
import { getLevel, getNextLevel, getPointsToNextLevel, getLevelColor } from "./StrengthScore/utils";

export const StrengthScore = () => {
  const { data: stats } = useQuery({
    queryKey: ['strength-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_stats')
        .select('session_duration_minutes, rest_time_seconds')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0];
    }
  });

  const score = Math.round((stats?.session_duration_minutes || 0) * 1.5);
  const maxScore = 100;
  const level = getLevel(score);
  const nextLevel = getNextLevel(level);
  const pointsToNextLevel = getPointsToNextLevel(score, level);

  return (
    <Card className="bg-[#1E2330] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-primary" />
          Score de force
        </h2>
        <div className="flex items-center gap-1">
          <Target className="w-3 h-3 text-primary" />
          <span className="text-xs text-gray-400">Objectif: {maxScore}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <ScoreCircle score={score} maxScore={maxScore} />
        
        <div className="flex-1 space-y-2">
          <LevelInfo 
            currentLevel={level}
            nextLevel={nextLevel}
            getLevelColor={getLevelColor}
          />

          <ProgressInfo 
            score={score}
            maxScore={maxScore}
            nextLevel={nextLevel}
            pointsToNextLevel={pointsToNextLevel}
            getLevelColor={getLevelColor}
          />
        </div>
      </div>
    </Card>
  );
};