
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { LoadingButton } from "./GenerateWorkout/LoadingButton";
import { WorkoutActions } from "./GenerateWorkout/WorkoutActions";
import { useWorkoutOperations } from "@/hooks/workout/use-workout-operations";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import { ScrollArea } from "@/components/ui/scroll-area";

// Constantes pour les entraînements générés
const generateWorkoutBasedOnInputs = (duration: number, intensity: number, type: string) => {
  // En fonction des paramètres, générer un entraînement personnalisé
  const exercises = [
    "Squats",
    "Pompes",
    "Fentes",
    "Tractions",
    "Mountain climbers",
    "Crunchs",
    "Gainage"
  ];

  // Variation du nombre d'exercices en fonction de la durée
  const exerciseCount = Math.max(3, Math.min(7, Math.floor(duration / 10)));
  
  // Sélectionner un sous-ensemble d'exercices
  const selectedExercises = exercises.slice(0, exerciseCount);
  
  return {
    exercises: selectedExercises,
    estimatedDuration: duration,
    intensity: intensity,
    type: type || "strength"
  };
};

export interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialDuration?: number;
  initialIntensity?: number;
  workoutType?: string;
}

export const GenerateWorkoutDialog = ({
  isOpen,
  onClose,
  initialDuration = 45,
  initialIntensity = 50,
  workoutType = ""
}: GenerateWorkoutDialogProps) => {
  const [duration, setDuration] = useState(initialDuration);
  const [intensity, setIntensity] = useState(initialIntensity);
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();
  const { startWorkout, isLoading: isStartingWorkout } = useWorkoutOperations();
  
  useEffect(() => {
    if (initialDuration) setDuration(initialDuration);
    if (initialIntensity) setIntensity(initialIntensity);
  }, [initialDuration, initialIntensity]);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      debugLogger.log("GenerateWorkoutDialog", "Génération d'un entraînement avec paramètres:", {
        duration,
        intensity,
        workoutType
      });
      
      // Simuler un délai de génération pour montrer un état de chargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Générer l'entraînement basé sur les entrées
      const workout = generateWorkoutBasedOnInputs(duration, intensity, workoutType);
      setGeneratedWorkout(workout);
    } catch (error) {
      console.error('Erreur lors de la génération:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedWorkout(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("workouts.generateWorkoutTitle")}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] max-h-[500px] pr-3">
          {!generatedWorkout ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t("workouts.duration")}</span>
                  <span className="text-sm">{duration} {t("workouts.min")}</span>
                </div>
                <Slider
                  value={[duration]}
                  min={10}
                  max={90}
                  step={5}
                  onValueChange={(values) => setDuration(values[0])}
                  className="py-4"
                />
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t("workouts.intensity")}</span>
                  <span className="text-sm">{intensity}%</span>
                </div>
                <Slider
                  value={[intensity]}
                  min={10}
                  max={100}
                  step={10}
                  onValueChange={(values) => setIntensity(values[0])}
                  className="py-4"
                />
              </div>
              
              <LoadingButton
                isLoading={isGenerating}
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full"
              >
                {t("workouts.generateWorkout")}
              </LoadingButton>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <GeneratedWorkoutPreview workout={generatedWorkout} />
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleRegenerate}
                  className="flex-1"
                >
                  {t("workouts.regenerate")}
                </Button>
                
                <Button 
                  onClick={() => startWorkout(generatedWorkout)}
                  disabled={isStartingWorkout}
                  className="flex-1"
                >
                  {isStartingWorkout 
                    ? t("workouts.startingSession") 
                    : t("workouts.startSession")}
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
        
        <DialogFooter className="flex justify-center">
          <p className="text-xs text-muted-foreground">{t("common.close")}</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
