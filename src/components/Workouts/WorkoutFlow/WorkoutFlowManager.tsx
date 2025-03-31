
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionActions } from "@/hooks/workout/use-session-actions";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";
import { Loader2 } from "lucide-react";

import { MuscleGroupSelection } from "../MuscleGroupSelection";
import { ExerciseSelection } from "../ExerciseSelection";
import { GeneratedWorkoutPreview } from "@/components/Dashboard/WorkoutSuggestions/GeneratedWorkoutPreview";
import { workoutSteps } from "./workoutSteps";
import { StepIndicator } from "./components/StepIndicator";
import { NavigationButtons } from "./components/NavigationButtons";
import { StartWorkoutStep } from "./components/StartWorkoutStep";
import { ExerciseSetManager } from "./components/ExerciseSetManager";
import { useWorkoutExercisesState } from "@/hooks/workout/use-workout-exercises-state";
import { TrainingTypeSelection } from "./components/TrainingTypeSelection";
import { SportPositionSelection } from "./components/SportPositionSelection";
import { useSportExerciseSelection } from "@/hooks/use-sport-exercise-selection";

export const WorkoutFlowManager = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [trainingType, setTrainingType] = useState<"muscle" | "sport" | null>(null);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const [selectedSportId, setSelectedSportId] = useState<string>("");
  const [selectedPositionId, setSelectedPositionId] = useState<string>("");
  const { createWorkoutSession } = useSessionActions();
  const { isLoading } = useWorkoutExercisesState();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { exercises: sportExercises, isLoading: sportExercisesLoading } = 
    useSportExerciseSelection(selectedSportId, selectedPositionId);

  const handleExerciseSelection = (exercises: string[]) => {
    setSelectedExercises(exercises);
    // Log pour déboguer
    debugLogger.log("WorkoutFlowManager", "Exercices sélectionnés:", exercises);
  };

  const handleMuscleGroupSelection = (muscleId: string) => {
    setSelectedMuscleGroup(muscleId);
    // Assurer que nous passons bien à l'étape de sélection d'exercices
    setCurrentStep(3);
    // Log pour déboguer
    debugLogger.log("WorkoutFlowManager", "Groupe musculaire sélectionné:", muscleId);
  };

  const handleTrainingTypeSelection = (type: "muscle" | "sport") => {
    setTrainingType(type);
    setCurrentStep(2);
    // Log pour déboguer
    debugLogger.log("WorkoutFlowManager", "Type d'entraînement sélectionné:", type);
  };

  const handleSportPositionSelection = (sportId: string, positionId: string) => {
    setSelectedSportId(sportId);
    setSelectedPositionId(positionId);
    
    // Une fois le sport et le poste sélectionnés, passer à la sélection des exercices
    if (sportExercises && sportExercises.length > 0) {
      setSelectedExercises(sportExercises);
      debugLogger.log("WorkoutFlowManager", "Exercices de sport chargés automatiquement:", sportExercises);
    } else {
      debugLogger.warn("WorkoutFlowManager", "Aucun exercice trouvé pour le sport et la position sélectionnés");
    }
    
    // Passer directement au récapitulatif pour les exercices par sport
    setCurrentStep(4);
  };

  const handleNext = () => {
    if (currentStep === 1 && !trainingType) {
      toast({
        title: "Sélection requise",
        description: "Veuillez choisir un type d'entraînement",
      });
      return;
    }
    
    if (currentStep === 2) {
      if (trainingType === "muscle" && !selectedMuscleGroup) {
        toast({
          title: "Sélection requise",
          description: "Veuillez sélectionner un groupe musculaire",
        });
        return;
      }
      
      if (trainingType === "sport" && (!selectedSportId || !selectedPositionId)) {
        toast({
          title: "Sélection requise",
          description: "Veuillez sélectionner un sport et un poste",
        });
        return;
      }
    }
    
    if (currentStep === 3 && selectedExercises.length === 0) {
      toast({
        title: "Sélection requise",
        description: "Veuillez sélectionner au moins un exercice",
      });
      return;
    }
    
    debugLogger.log("WorkoutFlowManager", "Progression à l'étape suivante:", currentStep + 1);
    
    if (currentStep < workoutSteps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleStartWorkout();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      debugLogger.log("WorkoutFlowManager", "Retour à l'étape précédente:", currentStep - 1);
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStartWorkout = async () => {
    if (!user) {
      debugLogger.warn("WorkoutFlowManager", "Tentative de démarrer l'entraînement sans être connecté");
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour créer une séance",
        variant: "destructive",
      });
      navigate('/signin', { state: { from: '/workouts' } });
      return;
    }

    if (selectedExercises.length > 0) {
      debugLogger.log("WorkoutFlowManager", "Démarrage d'entraînement avec exercices:", selectedExercises);
      await createWorkoutSession('custom', selectedExercises);
    } else {
      debugLogger.error("WorkoutFlowManager", "Tentative de démarrer un entraînement sans exercices sélectionnés");
      toast({
        title: "Aucun exercice sélectionné",
        description: "Vous devez sélectionner au moins un exercice pour commencer",
        variant: "destructive",
      });
    }
  };

  const handleExerciseComplete = () => {
    toast({
      title: "Exercice terminé",
      description: "Passez à l'exercice suivant",
    });
  };

  if (isLoading || sportExercisesLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 flex items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <TrainingTypeSelection onSelectTrainingType={handleTrainingTypeSelection} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            {trainingType === "muscle" ? (
              <MuscleGroupSelection onSelectMuscleGroup={handleMuscleGroupSelection} />
            ) : (
              <SportPositionSelection 
                onSelectSportPosition={handleSportPositionSelection}
                onBack={() => setCurrentStep(1)}
              />
            )}
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ExerciseSelection
              selectedExercises={selectedExercises}
              onSelectionChange={handleExerciseSelection}
              onClose={() => setCurrentStep(2)}
              muscleGroup={selectedMuscleGroup}
            />
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex justify-center"
          >
            <GeneratedWorkoutPreview exercises={selectedExercises} />
          </motion.div>
        );
      case 5:
        return (
          <StartWorkoutStep 
            exerciseCount={selectedExercises.length} 
            onStartWorkout={handleStartWorkout} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      {/* Progress Steps */}
      <StepIndicator steps={workoutSteps} currentStep={currentStep} />

      {/* Main Content */}
      <Card className="p-6">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </Card>

      {/* Navigation Buttons */}
      <NavigationButtons 
        currentStep={currentStep}
        totalSteps={workoutSteps.length}
        onBack={handleBack}
        onNext={handleNext}
        isNextDisabled={
          (currentStep === 1 && !trainingType) ||
          (currentStep === 3 && selectedExercises.length === 0)
        }
      />
    </div>
  );
};
