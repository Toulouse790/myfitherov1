
import { Card } from "@/components/ui/card";
import { Dumbbell, Flame, Clock } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { ExerciseDisplay } from "@/components/Workouts/shared/ExerciseDisplay";

export interface GeneratedWorkoutPreviewProps {
  workout: {
    exercises: string[];
    estimatedDuration?: number;
    intensity?: number;
    type?: string;
    sets?: number;
    reps?: number;
  };
}

export const GeneratedWorkoutPreview = ({ workout }: GeneratedWorkoutPreviewProps) => {
  const { t } = useLanguage();
  
  if (!workout || !workout.exercises || workout.exercises.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2 py-8">
          <Dumbbell className="h-10 w-10 text-muted-foreground opacity-40" />
          <p className="text-muted-foreground">{t("workouts.noExercisesFound") || "Aucun exercice trouvé"}</p>
        </div>
      </Card>
    );
  }

  // Utiliser des valeurs par défaut si non fournies
  const sets = workout.sets || 3;
  const reps = workout.reps || 12;
  const intensity = workout.intensity || 75;
  const duration = workout.estimatedDuration || 45;
  const type = workout.type || "strength";

  // Déterminer le niveau d'intensité pour affichage
  const getIntensityLevel = (intensityValue: number) => {
    if (intensityValue < 50) return t("workouts.intensity.low") || "Faible intensité";
    if (intensityValue < 75) return t("workouts.intensity.moderate") || "Intensité modérée";
    return t("workouts.intensity.high") || "Haute intensité";
  };

  // Calculer une estimation de calories brûlées
  const estimatedCalories = Math.round(duration * (intensity / 100) * 10);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-center">{t("workouts.workoutSummary") || "Résumé de l'entraînement"}</h2>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {duration} {t("workouts.min") || "min"} · ~{estimatedCalories} {t("workouts.kcal") || "kcal"}
          </span>
        </div>
        
        <Badge variant={intensity > 75 ? "destructive" : "outline"} className="flex items-center gap-1">
          <Flame className="h-3 w-3 text-primary" />
          <span>{getIntensityLevel(intensity)}</span>
        </Badge>
      </div>
      
      <div className="grid gap-3">
        {workout.exercises.map((exercise, index) => (
          <ExerciseDisplay 
            key={index}
            name={exercise}
            sets={sets}
            reps={reps}
          />
        ))}
      </div>
    </div>
  );
};
