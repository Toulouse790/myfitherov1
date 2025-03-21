
import { Progress } from "@/components/ui/progress";

interface WorkoutProgressProps {
  progress: number;
}

export const WorkoutProgress = ({ progress }: WorkoutProgressProps) => {
  return <Progress value={progress} className="h-2" />;
};
