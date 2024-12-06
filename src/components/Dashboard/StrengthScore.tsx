import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Target } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const StrengthScore = () => {
  const { data: stats } = useQuery({
    queryKey: ['strength-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_stats')
        .select('total_weight, average_intensity')
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data?.[0];
    }
  });

  const score = Math.round((stats?.average_intensity || 0) * 0.8);
  const maxScore = 100;
  const level = getLevel(score);
  const nextLevel = getNextLevel(level);
  const pointsToNextLevel = getPointsToNextLevel(score, level);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "débutant":
        return "text-blue-500";
      case "novice":
        return "text-green-500";
      case "intermédiaire":
        return "text-yellow-500";
      case "avancé":
        return "text-orange-500";
      case "expert":
        return "text-red-500";
      default:
        return "text-primary";
    }
  };

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
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{score}</span>
          </div>
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-gray-700"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - score / maxScore)}`}
              className="text-primary transition-all duration-1000 ease-out"
            />
          </svg>
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-400">Niveau actuel</div>
              <div className={`text-sm font-medium ${getLevelColor(level)}`}>
                {level}
              </div>
            </div>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Prochain niveau</span>
              <span className={`${getLevelColor(nextLevel)}`}>{nextLevel}</span>
            </div>
            <Progress 
              value={(score / maxScore) * 100} 
              className="h-1.5 [&>div]:bg-primary" 
            />
            <div className="text-[10px] text-gray-400 text-right">
              Plus que {pointsToNextLevel} points
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

function getLevel(score: number): string {
  if (score < 20) return "Débutant";
  if (score < 40) return "Novice";
  if (score < 60) return "Intermédiaire";
  if (score < 80) return "Avancé";
  return "Expert";
}

function getNextLevel(currentLevel: string): string {
  switch (currentLevel) {
    case "Débutant":
      return "Novice";
    case "Novice":
      return "Intermédiaire";
    case "Intermédiaire":
      return "Avancé";
    case "Avancé":
      return "Expert";
    default:
      return "Expert";
  }
}

function getPointsToNextLevel(score: number, currentLevel: string): number {
  const thresholds = {
    "Débutant": 20,
    "Novice": 40,
    "Intermédiaire": 60,
    "Avancé": 80,
    "Expert": 100
  };
  
  const nextLevel = getNextLevel(currentLevel);
  return thresholds[nextLevel as keyof typeof thresholds] - score;
}