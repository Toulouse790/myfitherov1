import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

interface NextExercisePreviewProps {
  nextExercise: string;
}

export const NextExercisePreview = ({ nextExercise }: NextExercisePreviewProps) => {
  return (
    <div className="mt-4">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">Prochain exercice:</h3>
      <Card className="p-4 bg-muted/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-primary" />
          </div>
          <span>{nextExercise}</span>
        </div>
      </Card>
    </div>
  );
};