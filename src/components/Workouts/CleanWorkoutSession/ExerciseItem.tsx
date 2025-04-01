
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface ExerciseItemProps {
  exerciseName: string;
  isCompleted: boolean;
  isCurrent: boolean;
  onClick: () => void;
}

export const ExerciseItem = ({ exerciseName, isCompleted, isCurrent, onClick }: ExerciseItemProps) => {
  return (
    <Card 
      className={`p-4 transition-all cursor-pointer hover:bg-gray-50 ${
        isCurrent ? 'border-primary' : ''
      } ${
        isCompleted ? 'bg-gray-50' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{exerciseName}</span>
        {isCompleted && (
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <Check className="w-4 h-4 text-white" />
          </div>
        )}
      </div>
    </Card>
  );
};
