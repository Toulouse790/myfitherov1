import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Dumbbell } from "lucide-react";

interface WorkoutCardProps {
  title: string;
  duration: string;
  exercises: number;
  onClick: () => void;
}

export const WorkoutCard = ({ title, duration, exercises, onClick }: WorkoutCardProps) => {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer animate-fade-up" onClick={onClick}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center">
            <Dumbbell className="w-4 h-4 mr-1" />
            {exercises} exercices
          </div>
        </div>
        
        <Button className="w-full" onClick={onClick}>
          Commencer
        </Button>
      </div>
    </Card>
  );
};