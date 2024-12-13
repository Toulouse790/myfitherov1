import { TrendingUp } from "lucide-react";

interface LevelInfoProps {
  currentLevel: string;
  nextLevel: string;
  getLevelColor: (level: string) => string;
}

export const LevelInfo = ({ currentLevel, nextLevel, getLevelColor }: LevelInfoProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-xs text-gray-400">Niveau actuel</div>
        <div className={`text-sm font-medium ${getLevelColor(currentLevel)}`}>
          {currentLevel}
        </div>
      </div>
      <TrendingUp className="w-4 h-4 text-primary" />
    </div>
  );
};