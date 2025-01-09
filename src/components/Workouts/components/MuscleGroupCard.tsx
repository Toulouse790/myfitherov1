import { Card, CardContent } from "@/components/ui/card";
import { 
  Dumbbell,
  ArrowBigUp,
  ArrowBigDown,
  Shirt,
  Arm,
  Hammer,
  Activity
} from "lucide-react";

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
  const getIcon = () => {
    switch (id) {
      case 'chest':
        return <Shirt className="h-4 w-4 text-primary" />;
      case 'back':
        return <ArrowBigUp className="h-4 w-4 text-primary" />;
      case 'legs':
        return <ArrowBigDown className="h-4 w-4 text-primary" />;
      case 'shoulders':
        return <Activity className="h-4 w-4 text-primary" />;
      case 'biceps':
      case 'triceps':
        return <Arm className="h-4 w-4 text-primary" />;
      case 'abs':
        return <Hammer className="h-4 w-4 text-primary" />;
      default:
        return <Dumbbell className="h-4 w-4 text-primary" />;
    }
  };

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
            {getIcon()}
          </div>
          <p className="font-medium text-sm">
            {name}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};