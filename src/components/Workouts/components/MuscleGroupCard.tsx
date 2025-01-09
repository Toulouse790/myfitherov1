import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

interface MuscleGroupCardProps {
  id: string;
  name: string;
  isSelected: boolean;
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
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Dumbbell className="h-4 w-4 text-primary" />
          </div>
          <p className="font-medium text-sm">
            {name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};