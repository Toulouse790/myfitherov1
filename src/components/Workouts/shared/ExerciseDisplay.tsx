
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";

interface ExerciseDisplayProps {
  name: string;
  sets?: number;
  reps?: number;
}

export function ExerciseDisplay({ name, sets = 3, reps = 10 }: ExerciseDisplayProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-4 w-4 text-primary" />
            <span className="font-medium">{name}</span>
          </div>
          
          <Badge variant="outline" className="text-xs">
            {sets} × {reps}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
