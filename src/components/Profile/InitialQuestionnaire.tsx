import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ObjectiveStep } from "./QuestionnaireSteps/ObjectiveStep";
import { TrainingFrequencyStep } from "./QuestionnaireSteps/TrainingFrequencyStep";
import { ActivityLevelStep } from "./QuestionnaireSteps/ActivityLevelStep";
import { TrainingLocationStep } from "./QuestionnaireSteps/TrainingLocationStep";

interface QuestionnaireResponses {
  objective: string;
  training_frequency: string;
  experience_level: string;
  available_equipment: string;
  workout_duration: string;
}

const INITIAL_RESPONSES: QuestionnaireResponses = {
  objective: "",
  training_frequency: "",
  experience_level: "",
  available_equipment: "",
  workout_duration: "60",
};

export const InitialQuestionnaire = () => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState<QuestionnaireResponses>(INITIAL_RESPONSES);
  const { toast } = useToast();
  const navigate = useNavigate();

  const saveResponse = async (finalResponses: QuestionnaireResponses) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour continuer",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    const { error } = await supabase
      .from("questionnaire_responses")
      .insert([
        {
          user_id: user.id,
          ...finalResponses
        }
      ]);

    if (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Configuration terminée",
      description: "Vos préférences ont été enregistrées avec succès !",
    });
    navigate("/");
  };

  const handleResponseChange = (field: keyof QuestionnaireResponses, value: string) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      await saveResponse(responses);
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ObjectiveStep
            objective={responses.objective}
            onObjectiveChange={(value) => handleResponseChange("objective", value)}
          />
        );
      case 2:
        return (
          <TrainingFrequencyStep
            workoutsPerWeek={responses.training_frequency}
            onWorkoutsPerWeekChange={(value) => handleResponseChange("training_frequency", value)}
            workoutDuration={responses.workout_duration}
            onWorkoutDurationChange={(value) => handleResponseChange("workout_duration", value)}
          />
        );
      case 3:
        return (
          <ActivityLevelStep
            activityLevel={responses.experience_level}
            onActivityLevelChange={(value) => handleResponseChange("experience_level", value)}
          />
        );
      case 4:
        return (
          <TrainingLocationStep
            trainingLocation={responses.available_equipment}
            onTrainingLocationChange={(value) => handleResponseChange("available_equipment", value)}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!responses.objective;
      case 2:
        return !!responses.training_frequency && !!responses.workout_duration;
      case 3:
        return !!responses.experience_level;
      case 4:
        return !!responses.available_equipment;
      default:
        return false;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Configuration initiale</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStep()}
          
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Précédent
            </Button>
            <div className="text-sm text-muted-foreground">
              Étape {step} sur 4
            </div>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {step === 4 ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};