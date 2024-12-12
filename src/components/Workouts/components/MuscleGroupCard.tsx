import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

interface MuscleGroupCardProps {
  id: string;
  name: string;
  isSelected: boolean;
  exerciseCount: number;
  onClick: () => void;
}

export const MuscleGroupCard = ({ 
  id, 
  name, 
  isSelected, 
  onClick 
}: MuscleGroupCardProps) => {
  return (
    <Card 
      className={`cursor-pointer transition-colors hover:bg-accent ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-primary" />
          </div>
          <p className="font-medium">
            {name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};