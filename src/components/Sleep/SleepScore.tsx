
import { Card, CardContent } from "@/components/ui/card";
import { useSleepTracking } from "@/hooks/use-sleep-tracking";
import { Loader2, TrendingDown, TrendingUp, Zap } from "lucide-react";

export const SleepScore = () => {
  const { sleepStats, isLoading } = useSleepTracking();

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  if (!sleepStats) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-semibold">Score de sommeil</h3>
        </div>
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          Pas assez de données pour calculer un score
        </div>
      </Card>
    );
  }

  // Arrondir les statistiques pour l'affichage
  const score = Math.round(sleepStats.average_score);
  const averageDuration = Math.floor(sleepStats.average_duration / 60) + 
    'h' + (sleepStats.average_duration % 60).toString().padStart(2, '0');
  const sleepDebt = Math.floor(sleepStats.sleep_debt_minutes / 60) + 
    'h' + (sleepStats.sleep_debt_minutes % 60).toString().padStart(2, '0');
  const trend = Math.round(sleepStats.weekly_trend);
  const consistency = Math.round(sleepStats.consistency_score);

  // Déterminer la couleur du score
  const getScoreColor = () => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    if (score >= 40) return "text-orange-500";
    return "text-red-500";
  };

  // Calculer le dashoffset pour le cercle de progression (circonférence = 2πr = 2 * π * 60 = 377)
  const circumference = 377;
  const dashOffset = circumference - (circumference * score) / 100;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="font-semibold">Score de sommeil</h3>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-around p-6 gap-6">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-4xl font-bold ${getScoreColor()}`}>{score}</span>
          </div>
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/20"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className={getScoreColor()}
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
          <div className="flex flex-col items-center p-2 border rounded-lg">
            <span className="text-sm text-muted-foreground">Durée moyenne</span>
            <span className="text-xl font-semibold">{averageDuration}</span>
          </div>
          <div className="flex flex-col items-center p-2 border rounded-lg">
            <span className="text-sm text-muted-foreground">Dette de sommeil</span>
            <span className="text-xl font-semibold">{sleepDebt}</span>
          </div>
          <div className="flex flex-col items-center p-2 border rounded-lg">
            <span className="text-sm text-muted-foreground">Tendance</span>
            <span className="text-xl font-semibold flex items-center">
              {trend > 0 ? (
                <>
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500">{trend}%</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  <span className="text-red-500">{Math.abs(trend)}%</span>
                </>
              )}
            </span>
          </div>
          <div className="flex flex-col items-center p-2 border rounded-lg">
            <span className="text-sm text-muted-foreground">Régularité</span>
            <span className="text-xl font-semibold flex items-center">
              <Zap className={`w-4 h-4 mr-1 ${consistency > 70 ? 'text-green-500' : 'text-yellow-500'}`} />
              {consistency}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
