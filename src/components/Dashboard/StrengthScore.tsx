import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp, Target } from "lucide-react";

export const StrengthScore = () => {
  const score = 56;
  const maxScore = 100;
  const level = "Novice";
  const nextLevel = "Intermédiaire";
  const pointsToNextLevel = 14;

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
    <Card className="bg-[#1E2330] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Score de force
        </h2>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-sm text-gray-400">Objectif: {maxScore}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">{score}</span>
          </div>
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-700"
            />
            <circle
              cx="48"
              cy="48"
              r="36"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={`${2 * Math.PI * 36}`}
              strokeDashoffset={`${2 * Math.PI * 36 * (1 - score / maxScore)}`}
              className="text-primary transition-all duration-1000 ease-out"
            />
          </svg>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-400">Niveau actuel</div>
              <div className={`text-lg font-medium ${getLevelColor(level)}`}>
                {level}
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Prochain niveau</span>
              <span className={`${getLevelColor(nextLevel)}`}>{nextLevel}</span>
            </div>
            <Progress 
              value={(score / maxScore) * 100} 
              className="h-2 [&>div]:bg-primary" 
            />
            <div className="text-xs text-gray-400 text-right">
              Plus que {pointsToNextLevel} points
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};