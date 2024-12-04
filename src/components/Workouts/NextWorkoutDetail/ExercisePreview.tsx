import { Dumbbell } from "lucide-react";

interface ExercisePreviewProps {
  exercise: string;
}

export const ExercisePreview = ({ exercise }: ExercisePreviewProps) => {
  return (
    <div className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Dumbbell className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium">{exercise}</h3>
          <p className="text-sm text-muted-foreground">3 séries • 12 répétitions</p>
        </div>
      </div>
    </div>
  );
};