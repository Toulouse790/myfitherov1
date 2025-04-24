
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useWorkoutOperations, WorkoutData } from "@/hooks/workout/use-workout-operations";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { debugLogger } from "@/utils/debug-logger";

/**
 * Génère un entraînement personnalisé basé sur les paramètres
 */
const generateWorkoutBasedOnInputs = (duration: number, intensity: number) => {
  const exercises = [
    "Squats",
    "Pompes",
    "Fentes",
    "Mountain climbers",
    "Crunchs",
    "Gainage",
    "Dips",
    "Élévations latérales",
    "Rowing haltère"
  ];

  // Nombre d'exercices selon la durée
  const exerciseCount = Math.max(3, Math.min(7, Math.floor(duration / 10)));
  
  // Sélection aléatoire
  const selectedExercises = exercises
    .sort(() => 0.5 - Math.random())
    .slice(0, exerciseCount);
  
  return {
    exercises: selectedExercises,
    estimatedDuration: duration,
    intensity: intensity
  };
};

export interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialDuration?: number;
  initialIntensity?: number;
}

export const GenerateWorkoutDialog = ({
  isOpen,
  onClose,
  initialDuration = 45,
  initialIntensity = 50
}: GenerateWorkoutDialogProps) => {
  const [duration, setDuration] = useState(initialDuration);
  const [intensity, setIntensity] = useState(initialIntensity);
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { startWorkout, isLoading: isStartingWorkout } = useWorkoutOperations();
  
  // Gestion de la génération d'entraînement
  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      debugLogger.log("Génération d'un entraînement avec paramètres:", {
        duration,
        intensity
      });
      
      // Simulation de délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Génération
      const workout = generateWorkoutBasedOnInputs(duration, intensity);
      debugLogger.log("Entraînement généré:", workout);
      setGeneratedWorkout(workout);
      
      toast({
        title: t("workouts.sessionGenerated", { fallback: "Séance générée" }),
        description: t("workouts.sessionGeneratedDescription", { fallback: "Voici votre séance d'entraînement personnalisée" })
      });
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      toast({
        title: t("common.error", { fallback: "Erreur" }),
        description: t("workouts.errors.sessionGenerationError", { fallback: "Impossible de générer la séance" }),
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Régénération
  const handleRegenerate = async () => {
    setGeneratedWorkout(null);
    handleGenerate();
  };

  // Démarrage de l'entraînement
  const handleStartWorkout = async () => {
    if (!generatedWorkout?.exercises?.length) {
      toast({
        title: t("common.error", { fallback: "Erreur" }),
        description: t("workouts.errors.noExercisesSelected", { fallback: "Aucun exercice sélectionné pour la séance" }),
        variant: "destructive",
      });
      return;
    }
    
    try {
      debugLogger.log("Démarrage de la session avec:", {
        exercises: generatedWorkout.exercises,
        duration: generatedWorkout.estimatedDuration,
        intensity: generatedWorkout.intensity
      });
      
      // Données pour la séance
      const workoutData: WorkoutData = {
        exercises: generatedWorkout.exercises,
        duration: generatedWorkout.estimatedDuration,
        intensity: generatedWorkout.intensity
      };
      
      // Démarrer la séance
      await startWorkout(workoutData);
      
    } catch (error) {
      console.error('Erreur lors du démarrage de la séance:', error);
      toast({
        title: t("common.error", { fallback: "Erreur" }),
        description: t("workouts.errors.sessionStartError", { fallback: "Impossible de démarrer la séance" }),
        variant: "destructive",
      });
    }
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
              
              <Button
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("workouts.generationLoading")}
                  </>
                ) : (
                  t("workouts.generateSession")
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <GeneratedWorkoutPreview workout={generatedWorkout} />
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={handleRegenerate}
                  className="flex-1"
                  disabled={isGenerating || isStartingWorkout}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("workouts.generating", { fallback: "Régénération..." })}
                    </>
                  ) : (
                    t("workouts.regenerate")
                  )}
                </Button>
                
                <Button 
                  onClick={handleStartWorkout}
                  disabled={isStartingWorkout}
                  className="flex-1"
                >
                  {isStartingWorkout ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("workouts.startingSession")}
                    </>
                  ) : (
                    t("workouts.startSession")
                  )}
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
