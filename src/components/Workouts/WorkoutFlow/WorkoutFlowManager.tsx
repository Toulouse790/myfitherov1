
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { useSessionActions } from "@/hooks/workout/use-session-actions";
import { useToast } from "@/hooks/use-toast";
import { debugLogger } from "@/utils/debug-logger";

import { MuscleGroupSelection } from "../MuscleGroupSelection";
import { ExerciseSelection } from "../ExerciseSelection";
import { GeneratedWorkoutPreview } from "@/components/Dashboard/WorkoutSuggestions/GeneratedWorkoutPreview";
import { workoutSteps } from "./workoutSteps";
import { StepIndicator } from "./components/StepIndicator";
import { NavigationButtons } from "./components/NavigationButtons";
import { StartWorkoutStep } from "./components/StartWorkoutStep";

export const WorkoutFlowManager = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("");
  const { createWorkoutSession } = useSessionActions();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleExerciseSelection = (exercises: string[]) => {
    setSelectedExercises(exercises);
  };

  const handleMuscleGroupSelection = (muscleId: string) => {
    setSelectedMuscleGroup(muscleId);
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep < workoutSteps.length) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleStartWorkout();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
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
    }
  };

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
            <MuscleGroupSelection onSelectMuscleGroup={handleMuscleGroupSelection} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ExerciseSelection
              selectedExercises={selectedExercises}
              onSelectionChange={handleExerciseSelection}
              onClose={() => setCurrentStep(1)}
              muscleGroup={selectedMuscleGroup}
            />
          </motion.div>
        );
      case 3:
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
      case 4:
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
        isNextDisabled={currentStep === 2 && selectedExercises.length === 0}
      />
    </div>
  );
};
