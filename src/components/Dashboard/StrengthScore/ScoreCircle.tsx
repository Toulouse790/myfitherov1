import { Trophy } from "lucide-react";

interface ScoreCircleProps {
  score: number;
  maxScore: number;
}

export const ScoreCircle = ({ score, maxScore }: ScoreCircleProps) => {
  return (
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
  );
};