
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ObjectiveStep } from "./QuestionnaireSteps/ObjectiveStep";
import { TrainingFrequencyStep } from "./QuestionnaireSteps/TrainingFrequencyStep";
import { ActivityLevelStep } from "./QuestionnaireSteps/ActivityLevelStep";
import { TrainingLocationStep } from "./QuestionnaireSteps/TrainingLocationStep";
import { DietTypeStep } from "./QuestionnaireSteps/DietTypeStep";
import { PersonalInfoStep } from "./QuestionnaireSteps/PersonalInfoStep";
import { GenderStep } from "./QuestionnaireSteps/GenderStep";
import { useQuestionnaireLogic } from "./QuestionnaireSteps/QuestionnaireLogic";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useClaudeRecommendations } from "@/hooks/use-claude-recommendations";
import { Loader2 } from "lucide-react";

export const InitialQuestionnaire = () => {
  const {
    step,
    responses,
    handleResponseChange,
    handleNext,
    handleBack,
    isStepValid,
  } = useQuestionnaireLogic();
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: recommendations, isLoading: isGeneratingRecommendations } = useClaudeRecommendations(
    step === 7 ? responses : null
  );

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/signup");
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Ne rien afficher pendant la vérification de la session
  if (!user) return null;

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <GenderStep
            gender={responses.gender}
            onGenderChange={(value) => handleResponseChange("gender", value)}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            age={responses.age?.toString() || ""}
            weight={responses.weight?.toString() || ""}
            height={responses.height?.toString() || ""}
            onAgeChange={(value) => handleResponseChange("age", Number(value))}
            onWeightChange={(value) => handleResponseChange("weight", Number(value))}
            onHeightChange={(value) => handleResponseChange("height", Number(value))}
          />
        );
      case 3:
        return (
          <ObjectiveStep
            objective={responses.objective}
            onObjectiveChange={(value) => handleResponseChange("objective", value)}
          />
        );
      case 4:
        return (
          <TrainingFrequencyStep
            workoutsPerWeek={responses.training_frequency?.toString() || ""}
            onWorkoutsPerWeekChange={(value) => handleResponseChange("training_frequency", Number(value))}
            workoutDuration={responses.workout_duration?.toString() || ""}
            onWorkoutDurationChange={(value) => handleResponseChange("workout_duration", Number(value))}
          />
        );
      case 5:
        return (
          <ActivityLevelStep
            activityLevel={responses.experience_level}
            onActivityLevelChange={(value) => handleResponseChange("experience_level", value)}
          />
        );
      case 6:
        return (
          <TrainingLocationStep
            trainingLocation={responses.available_equipment}
            onTrainingLocationChange={(value) => handleResponseChange("available_equipment", value)}
          />
        );
      case 7:
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

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-lg mx-auto">
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
              Étape {step} sur 7
            </div>
            <Button
              onClick={step === 7 ? handleNext : handleNext}
              disabled={!isStepValid() || (step === 7 && isGeneratingRecommendations)}
            >
              {step === 7 ? (
                isGeneratingRecommendations ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération des recommandations...
                  </>
                ) : (
                  "Terminer"
                )
              ) : (
                "Suivant"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
