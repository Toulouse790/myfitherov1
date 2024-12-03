import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const StrengthScore = () => {
  const score = 56;
  const maxScore = 100;
  const level = "Novice";

  return (
    <Card className="bg-[#1E2330] p-4 space-y-2">
      <h2 className="text-xl font-semibold text-white">Score de force</h2>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-white">{score}</span>
          </div>
          <Progress value={(score / maxScore) * 100} className="h-2 w-full absolute bottom-0" indicatorColor="bg-[#F97316]" />
        </div>
        <div className="space-y-1">
          <div className="text-lg font-medium text-white">{level}</div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{score}</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-400">{maxScore}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};