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
import { DietTypeStep } from "./QuestionnaireSteps/DietTypeStep";
import { PersonalInfoStep } from "./QuestionnaireSteps/PersonalInfoStep";

interface QuestionnaireResponses {
  objective: string;
  training_frequency: string;
  experience_level: string;
  available_equipment: string;
  workout_duration: string;
  diet_type: string;
  gender: string;
  age: string;
  weight: string;
  height: string;
}

const INITIAL_RESPONSES: QuestionnaireResponses = {
  objective: "",
  training_frequency: "",
  experience_level: "",
  available_equipment: "",
  workout_duration: "60",
  diet_type: "omnivore",
  gender: "male",
  age: "",
  weight: "",
  height: "",
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

    // Save questionnaire responses
    const { error: questionnaireError } = await supabase
      .from("questionnaire_responses")
      .insert([{
        user_id: user.id,
        objective: finalResponses.objective,
        training_frequency: finalResponses.training_frequency,
        experience_level: finalResponses.experience_level,
        available_equipment: finalResponses.available_equipment,
        workout_duration: finalResponses.workout_duration,
        diet_type: finalResponses.diet_type,
        gender: finalResponses.gender,
      }]);

    if (questionnaireError) {
      console.error("Erreur lors de la sauvegarde du questionnaire:", questionnaireError);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos réponses",
        variant: "destructive",
      });
      return;
    }

    // Save measurements
    const { error: measurementsError } = await supabase
      .from("muscle_measurements")
      .insert([{
        user_id: user.id,
        height_cm: parseFloat(finalResponses.height),
        weight_kg: parseFloat(finalResponses.weight),
      }]);

    if (measurementsError) {
      console.error("Erreur lors de la sauvegarde des mesures:", measurementsError);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde de vos mesures",
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
    if (step < 6) {
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
          <PersonalInfoStep
            age={responses.age}
            weight={responses.weight}
            height={responses.height}
            gender={responses.gender}
            onAgeChange={(value) => handleResponseChange("age", value)}
            onWeightChange={(value) => handleResponseChange("weight", value)}
            onHeightChange={(value) => handleResponseChange("height", value)}
            onGenderChange={(value) => handleResponseChange("gender", value)}
          />
        );
      case 2:
        return (
          <ObjectiveStep
            objective={responses.objective}
            onObjectiveChange={(value) => handleResponseChange("objective", value)}
          />
        );
      case 3:
        return (
          <TrainingFrequencyStep
            workoutsPerWeek={responses.training_frequency}
            onWorkoutsPerWeekChange={(value) => handleResponseChange("training_frequency", value)}
            workoutDuration={responses.workout_duration}
            onWorkoutDurationChange={(value) => handleResponseChange("workout_duration", value)}
          />
        );
      case 4:
        return (
          <ActivityLevelStep
            activityLevel={responses.experience_level}
            onActivityLevelChange={(value) => handleResponseChange("experience_level", value)}
          />
        );
      case 5:
        return (
          <TrainingLocationStep
            trainingLocation={responses.available_equipment}
            onTrainingLocationChange={(value) => handleResponseChange("available_equipment", value)}
          />
        );
      case 6:
        return (
          <DietTypeStep
            dietType={responses.diet_type}
            onDietTypeChange={(value) => handleResponseChange("diet_type", value)}
          />
        );
      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!responses.gender && !!responses.age && !!responses.weight && !!responses.height;
      case 2:
        return !!responses.objective;
      case 3:
        return !!responses.training_frequency && !!responses.workout_duration;
      case 4:
        return !!responses.experience_level;
      case 5:
        return !!responses.available_equipment;
      case 6:
        return !!responses.diet_type;
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
              Étape {step} sur 6
            </div>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {step === 6 ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};