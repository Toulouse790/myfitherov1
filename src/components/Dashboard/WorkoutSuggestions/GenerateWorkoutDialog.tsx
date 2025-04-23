
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useWorkoutOperations, WorkoutData } from "@/hooks/workout/use-workout-operations";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Constantes pour les entraînements générés
const generateWorkoutBasedOnInputs = (duration: number, intensity: number, type: string) => {
  // En fonction des paramètres, générer un entraînement personnalisé
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

  // Variation du nombre d'exercices en fonction de la durée
  const exerciseCount = Math.max(3, Math.min(7, Math.floor(duration / 10)));
  
  // Sélectionner un sous-ensemble d'exercices
  const selectedExercises = exercises
    .sort(() => 0.5 - Math.random())
    .slice(0, exerciseCount);
  
  return {
    exercises: selectedExercises,
    estimatedDuration: duration,
    intensity: intensity,
    type: "strength" // Toujours utiliser "strength" pour garantir la compatibilité
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
  workoutType = "strength" // Valeur par défaut garantie
}: GenerateWorkoutDialogProps) => {
  const [duration, setDuration] = useState(initialDuration);
  const [intensity, setIntensity] = useState(initialIntensity);
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();
  const { startWorkout, isLoading: isStartingWorkout } = useWorkoutOperations();
  
  useEffect(() => {
    if (initialDuration) setDuration(initialDuration);
    if (initialIntensity) setIntensity(initialIntensity);
    console.log("GenerateWorkoutDialog initialisé avec:", { 
      initialDuration, initialIntensity, workoutType 
    });
    debugLogger.log("GenerateWorkoutDialog", "Dialog initialized with params:", { 
      initialDuration, initialIntensity, workoutType 
    });
  }, [initialDuration, initialIntensity, workoutType]);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      console.log("Génération d'un entraînement avec paramètres:", {
        duration,
        intensity,
        workoutType: "strength" // Utiliser la valeur fixe pour garantir la compatibilité
      });
      
      debugLogger.log("GenerateWorkoutDialog", "Génération d'un entraînement avec paramètres:", {
        duration,
        intensity,
        workoutType: "strength"
      });
      
      // Simuler un délai de génération pour montrer un état de chargement
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Générer l'entraînement basé sur les entrées
      const workout = generateWorkoutBasedOnInputs(duration, intensity, "strength");
      console.log("Entraînement généré:", workout);
      debugLogger.log("GenerateWorkoutDialog", "Entraînement généré:", workout);
      setGeneratedWorkout(workout);
      
      toast({
        title: t("workouts.sessionCreated") || "Séance générée",
        description: t("workouts.workoutSummary") || "Voici votre séance d'entraînement personnalisée"
      });
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      debugLogger.error("GenerateWorkoutDialog", "Erreur lors de la génération:", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.errors.sessionCreationFailed") || "Impossible de générer la séance",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    setGeneratedWorkout(null);
    handleGenerate();
  };

  const handleStartWorkout = async () => {
    if (!generatedWorkout || !generatedWorkout.exercises || generatedWorkout.exercises.length === 0) {
      console.error("Aucun exercice sélectionné pour la séance");
      toast({
        title: "Erreur",
        description: "Aucun exercice sélectionné pour la séance",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("=== DÉBUT DÉMARRAGE SÉANCE DEPUIS DIALOG ===");
      console.log("Démarrage de la session avec exercises:", generatedWorkout.exercises);
      
      debugLogger.log("GenerateWorkoutDialog", "Démarrage de la session avec exercises:", 
        generatedWorkout.exercises);
      
      // Structurer les données avec toutes les propriétés requises
      const workoutData: WorkoutData = {
        exercises: generatedWorkout.exercises,
        duration: generatedWorkout.estimatedDuration,
        intensity: generatedWorkout.intensity,
        type: "strength" // Utiliser une valeur fixe valide
      };
      
      console.log("Données envoyées à startWorkout:", JSON.stringify(workoutData));
      debugLogger.log("GenerateWorkoutDialog", "Données envoyées à startWorkout:", workoutData);
      
      // Appel de la fonction pour démarrer la séance
      const result = await startWorkout(workoutData);
      
      if (result) {
        debugLogger.log("GenerateWorkoutDialog", "Séance démarrée avec succès");
      } else {
        console.error("Échec de la création de séance");
        debugLogger.error("GenerateWorkoutDialog", "Échec de la création de séance");
      }
      
      // La navigation est gérée dans le hook startWorkout
    } catch (error) {
      console.error('Erreur lors du démarrage de la séance:', error);
      debugLogger.error("GenerateWorkoutDialog", "Erreur lors du démarrage de la séance:", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.errors.startSessionErrorDescription") || "Impossible de démarrer la séance",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md md:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("workouts.generateWorkoutTitle") || "Générer un entraînement"}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[60vh] max-h-[500px] pr-3">
          {!generatedWorkout ? (
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{t("workouts.duration") || "Durée"}</span>
                  <span className="text-sm">{duration} {t("workouts.min") || "min"}</span>
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
                  <span className="text-sm font-medium">{t("workouts.intensity") || "Intensité"}</span>
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
                    {t("workouts.generationLoading") || "Génération en cours..."}
                  </>
                ) : (
                  t("workouts.generateWorkout") || "Générer un entraînement"
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
                      {t("workouts.regenerating") || "Régénération..."}
                    </>
                  ) : (
                    t("workouts.regenerate") || "Régénérer"
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
                      {t("workouts.startingSession") || "Démarrage..."} 
                    </>
                  ) : (
                    t("workouts.startSession") || "Commencer la séance"
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
