import { Progress } from "@/components/ui/progress";

interface ProgressInfoProps {
  score: number;
  maxScore: number;
  nextLevel: string;
  pointsToNextLevel: number;
  getLevelColor: (level: string) => string;
}

export const ProgressInfo = ({ 
  score, 
  maxScore, 
  nextLevel, 
  pointsToNextLevel,
  getLevelColor 
}: ProgressInfoProps) => {
  return (
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
  );
};