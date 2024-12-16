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
      className={`cursor-pointer transition-all hover:bg-accent ${
        isSelected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Dumbbell className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionner pour voir les exercices
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};