
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MuscleGroupGrid } from "./components/MuscleGroupGrid";
import { ExerciseSelection } from "./ExerciseSelection";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { debugLogger } from "@/utils/debug-logger";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useLanguage } from "@/contexts/LanguageContext";

export const ExerciseLibrary = () => {
  const { t } = useLanguage();
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [showSelection, setShowSelection] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [showSummary, setShowSummary] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { startWorkout } = useWorkoutSession();

  const handleExerciseSelection = async (exerciseIds: string[]) => {
    setSelectedExercises(exerciseIds);
  };

  const handleStartWorkout = async () => {
    if (selectedExercises.length === 0) {
      toast({
        title: t("workouts.noExercisesFound"),
        description: t("workouts.selectExercisesToStart", { fallback: "Veuillez sélectionner au moins un exercice" }),
        variant: "destructive",
      });
      return;
    }

    try {
      debugLogger.log("ExerciseLibrary", "Création d'une nouvelle session avec les exercices:", selectedExercises);
      
      const session = await startWorkout(undefined, selectedExercises);
      
      if (!session) {
        throw new Error("Impossible de créer la session");
      }
    } catch (error) {
      console.error('Erreur lors de la création de la séance:', error);
      toast({
        title: t("workouts.errors.sessionCreationFailed"),
        description: t("workouts.errors.sessionCreationError"),
        variant: "destructive",
      });
    }
  };

  const handleMuscleGroupSelect = (muscleGroup: string) => {
    setSelectedMuscleGroup(muscleGroup);
    setShowSelection(true);
  };

  const handleCloseSelection = () => {
    setShowSelection(false);
    if (selectedExercises.length > 0) {
      toast({
        title: t("workouts.exercisesAdded", { fallback: "Exercices ajoutés" }),
        description: t("workouts.wantToTrainOtherMuscle", { fallback: "Voulez-vous entraîner un autre groupe musculaire ?" }),
        action: (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setShowSelection(false);
                handleStartWorkout();
              }}
            >
              {t("common.no", { fallback: "Non" })}, {t("workouts.startWorkout", { fallback: "commencer" })}
            </Button>
            <Button 
              size="sm"
              onClick={() => {
                setSelectedMuscleGroup("");
                setShowSelection(true);
              }}
            >
              {t("common.yes", { fallback: "Oui" })}
            </Button>
          </div>
        ),
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {selectedExercises.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end mb-6"
          >
            <Button onClick={handleStartWorkout} className="w-full sm:w-auto">
              {t("workouts.startWorkout", { fallback: "C'est parti !" })} ({selectedExercises.length} {t("workouts.exercises", { fallback: "exercices" })})
            </Button>
          </motion.div>
        )}

        {showSelection ? (
          <ExerciseSelection
            selectedExercises={selectedExercises}
            onSelectionChange={handleExerciseSelection}
            onClose={handleCloseSelection}
            muscleGroup={selectedMuscleGroup}
          />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h1 className="text-xl font-bold text-center mb-2">
              {t("workouts.selectTargetMuscles", { fallback: "Sélectionnez les groupes musculaires à travailler" })}
            </h1>
            <MuscleGroupGrid onSelect={handleMuscleGroupSelect} />
          </motion.div>
        )}

        <Dialog open={showSummary} onOpenChange={setShowSummary}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("workouts.workoutSummary", { fallback: "Récapitulatif de la séance" })}</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 my-4">
              {selectedExercises.map((exercise, index) => (
                <Card key={index} className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">{exercise}</h3>
                    <div className="text-sm text-muted-foreground">
                      3 {t("workouts.set", { fallback: "séries" })} • 12 {t("common.repetitions", { fallback: "répétitions" })}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSummary(false)}>
                {t("common.back", { fallback: "Retour" })}
              </Button>
              <Button onClick={handleStartWorkout}>
                {t("workouts.startWorkout", { fallback: "Commencer la séance" })}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
