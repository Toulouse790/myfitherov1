import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { List, ClipboardList, Play, ArrowLeft, ArrowRight } from "lucide-react";
import { ExerciseSelection } from "../ExerciseSelection";
import { GeneratedWorkoutPreview } from "@/components/Dashboard/WorkoutSuggestions/GeneratedWorkoutPreview";
import { useWorkoutSession } from "@/hooks/use-workout-session";

const steps = [
  { id: 1, title: "Sélection des exercices", icon: List },
  { id: 2, title: "Récapitulatif", icon: ClipboardList },
  { id: 3, title: "Démarrage", icon: Play }
];

export const WorkoutFlowManager = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const { createWorkoutSession } = useWorkoutSession();

  const handleExerciseSelection = (exercises: string[]) => {
    setSelectedExercises(exercises);
  };

  const handleNext = () => {
    if (currentStep < 3) {
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
    if (selectedExercises.length > 0) {
      await createWorkoutSession('custom');
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
          >
            <ExerciseSelection
              selectedExercises={selectedExercises}
              onSelectionChange={handleExerciseSelection}
              onClose={() => {}}
              muscleGroup=""
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <GeneratedWorkoutPreview exercises={selectedExercises} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <h2 className="text-2xl font-bold">Prêt à commencer ?</h2>
            <p className="text-muted-foreground">
              {selectedExercises.length} exercices sélectionnés
            </p>
            <Button 
              size="lg"
              onClick={handleStartWorkout}
              className="w-full sm:w-auto"
            >
              <Play className="w-5 h-5 mr-2" />
              Démarrer l'entraînement
            </Button>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      {/* Progress Steps */}
      <div className="flex justify-between items-center mb-8">
        {steps.map((step) => {
          const StepIcon = step.icon;
          return (
            <div
              key={step.id}
              className={`flex flex-col items-center space-y-2 ${
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                <StepIcon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium hidden sm:block">{step.title}</span>
            </div>
          );
        })}
      </div>

      {/* Main Content */}
      <Card className="p-6">
        <AnimatePresence mode="wait">
          {renderStepContent()}
        </AnimatePresence>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>

        <Button
          onClick={handleNext}
          disabled={selectedExercises.length === 0}
        >
          {currentStep === 3 ? (
            <>
              Commencer
              <Play className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};