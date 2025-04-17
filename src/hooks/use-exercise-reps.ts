
import { useState, useEffect } from 'react';
import { useToast } from "./use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export interface RepSettings {
  exerciseName: string;
  reps: number;
}

export const useExerciseReps = (exerciseName: string) => {
  const [reps, setReps] = useState<number>(12); // Valeur par défaut
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    // Charger les répétitions depuis le localStorage lors du montage du composant
    try {
      const savedRepsData = localStorage.getItem('exercise-reps');
      if (savedRepsData) {
        const repsData: RepSettings[] = JSON.parse(savedRepsData);
        const exerciseReps = repsData.find(item => item.exerciseName === exerciseName);
        if (exerciseReps) {
          setReps(exerciseReps.reps);
          debugLogger.log("useExerciseReps", "Répétitions chargées pour", exerciseName, ":", exerciseReps.reps);
        }
      }
    } catch (error) {
      debugLogger.error("useExerciseReps", "Erreur lors du chargement des répétitions:", error);
    }
  }, [exerciseName]);

  const updateReps = (newReps: number) => {
    if (typeof newReps !== 'number' || isNaN(newReps) || newReps < 1) {
      const errorMessage = t('workouts.errors.invalidRepsValue') || 'Valeur de répétitions invalide';
      debugLogger.error('useExerciseReps', errorMessage);
      toast({
        title: t("common.error"),
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }

    try {
      // Mettre à jour l'état local
      setReps(newReps);
      
      // Charger les données existantes
      const savedRepsData = localStorage.getItem('exercise-reps');
      const repsData: RepSettings[] = savedRepsData ? JSON.parse(savedRepsData) : [];
      
      // Trouver l'entrée existante ou en créer une nouvelle
      const existingIndex = repsData.findIndex(item => item.exerciseName === exerciseName);
      
      if (existingIndex >= 0) {
        repsData[existingIndex].reps = newReps;
      } else {
        repsData.push({ exerciseName, reps: newReps });
      }
      
      // Sauvegarder les données mises à jour
      localStorage.setItem('exercise-reps', JSON.stringify(repsData));
      
      toast({
        title: t("common.success"),
        description: t("workouts.repsUpdatedSuccessfully") || "Répétitions mises à jour avec succès",
      });
      
      debugLogger.log("useExerciseReps", "Répétitions mises à jour pour", exerciseName, ":", newReps);
    } catch (error) {
      debugLogger.error("useExerciseReps", "Erreur lors de la mise à jour des répétitions:", error);
      toast({
        title: t("common.error"),
        description: t("workouts.errors.repsUpdateFailed") || "Impossible de mettre à jour les répétitions",
        variant: "destructive",
      });
    }
  };

  return { reps, updateReps };
};
