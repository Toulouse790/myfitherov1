
import { Card } from "@/components/ui/card";
import { Dumbbell } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface GeneratedWorkoutPreviewProps {
  workout: {
    exercises: string[];
    estimatedDuration?: number;
    intensity?: number;
  };
}

export const GeneratedWorkoutPreview = ({ workout }: GeneratedWorkoutPreviewProps) => {
  const { t } = useLanguage();
  
  if (!workout || !workout.exercises) {
    return <div>{t("workouts.noExercisesFound")}</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-center">{t("workouts.personalisedSession")}</h2>
      <div className="grid gap-4">
        {workout.exercises.map((exercise, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{exercise}</h3>
                <p className="text-sm text-muted-foreground">
                  3 {t("workouts.sets")} • 12 {t("workouts.reps")}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
