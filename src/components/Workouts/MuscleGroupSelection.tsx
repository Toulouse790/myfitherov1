
import { useState } from "react";
import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { muscleGroups } from "./workoutConstants";
import { MuscleGroupCard } from "./components/MuscleGroupCard";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";
import { filterExercisesByMuscleGroup } from "./utils/exerciseFilters";
import { useExerciseSelection } from "@/hooks/use-exercise-selection";

const MuscleGroupSelection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { exercises, isLoading: exercisesLoading } = useExerciseSelection();

  const handleMuscleGroupSelect = (muscleId: string) => {
    setSelectedMuscleGroup(previousId => {
      // Toggle selection if clicking the same group
      return previousId === muscleId ? null : muscleId;
    });
  };

  const handleCreateSession = async () => {
    if (!selectedMuscleGroup) {
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.selectMuscleGroupFirst") || "Veuillez sélectionner un groupe musculaire",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.errors.loginRequired") || "Vous devez être connecté pour créer une séance",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      debugLogger.log("MuscleGroupSelection", "Création d'une séance avec groupe musculaire:", selectedMuscleGroup);
      
      // Filtre les exercices selon le groupe musculaire sélectionné
      const filteredExercises = Array.isArray(exercises) 
        ? filterExercisesByMuscleGroup(exercises, selectedMuscleGroup)
        : [];
      
      if (filteredExercises.length === 0) {
        throw new Error("Aucun exercice trouvé pour ce groupe musculaire");
      }

      // Sélectionner 4-6 exercices aléatoirement
      const randomExercises = filteredExercises
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(6, filteredExercises.length));
      
      const selectedExerciseNames = randomExercises.map(ex => 
        typeof ex === 'string' ? ex : (ex.name || '')
      ).filter(Boolean);

      if (selectedExerciseNames.length === 0) {
        throw new Error("Erreur lors de la sélection des exercices");
      }

      // Créer une nouvelle session
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          status: 'in_progress',
          workout_type: selectedMuscleGroup,
          exercises: selectedExerciseNames,
          target_duration_minutes: 45,
          started_at: new Date().toISOString()
        })
        .select('id')
        .single();

      if (error) {
        debugLogger.error("MuscleGroupSelection", "Erreur lors de la création:", error);
        throw error;
      }

      // Rediriger vers la page de session
      toast({
        title: t("workouts.sessionCreated") || "Séance créée",
        description: t("workouts.startingSession") || "Démarrage de votre séance...",
      });
      
      navigate(`/workouts/session/${data.id}`);
      
    } catch (error) {
      debugLogger.error("MuscleGroupSelection", "Erreur création séance:", error);
      toast({
        title: t("common.error") || "Erreur",
        description: t("workouts.errors.sessionCreationFailed") || "Impossible de créer la séance",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 pt-16 pb-24">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <h1 className="text-2xl font-bold text-center">
            {t("workouts.createSession") || "Créer une séance"}
          </h1>
          
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {muscleGroups.map((muscle) => (
              <MuscleGroupCard
                key={muscle.id}
                id={muscle.id}
                name={muscle.name}
                isSelected={selectedMuscleGroup === muscle.id}
                onClick={() => handleMuscleGroupSelect(muscle.id)}
              />
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <Button 
              onClick={handleCreateSession} 
              disabled={!selectedMuscleGroup || isLoading}
              size="lg"
              className="w-full max-w-md"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("common.loading") || "Chargement..."}
                </>
              ) : (
                t("workouts.createSessionWithSelectedMuscles") || "Créer une séance avec les muscles sélectionnés"
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MuscleGroupSelection;
