import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";

interface GeneratedWorkoutPreviewProps {
  exercises: string[];
}

export const GeneratedWorkoutPreview = ({ exercises }: GeneratedWorkoutPreviewProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">Votre séance personnalisée</h2>
      <div className="grid gap-4">
        {exercises.map((exercise, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{exercise}</h3>
                <p className="text-sm text-muted-foreground">
                  3 séries • 12 répétitions
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};