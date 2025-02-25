
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
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useClaudeRecommendations } from "@/hooks/use-claude-recommendations";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const location = useLocation();
  const { t } = useLanguage();

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

  if (!user) return null;

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from("questionnaire_responses")
        .insert({
          user_id: user.id,
          gender: responses.gender,
          age: responses.age,
          height: responses.height,
          weight: responses.weight,
          objective: responses.objective,
          training_frequency: responses.training_frequency,
          workout_duration: responses.workout_duration,
          experience_level: responses.experience_level,
          available_equipment: responses.available_equipment,
          diet_type: responses.diet_type
        });

      if (error) {
        throw error;
      }

      navigate("/questionnaire-complete", { 
        state: { returnTo: location.state?.from?.pathname || "/" },
        replace: true 
      });
      
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du questionnaire:", error);
      toast({
        title: t("common.error"),
        description: t("questionnaire.submitError"),
        variant: "destructive"
      });
    }
  };

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
              {t("common.previous")}
            </Button>
            <div className="text-sm text-muted-foreground">
              {t("questionnaire.step", { step, total: 7 })}
            </div>
            <Button
              onClick={step === 7 ? handleSubmit : handleNext}
              disabled={!isStepValid() || (step === 7 && isGeneratingRecommendations)}
            >
              {step === 7 ? (
                isGeneratingRecommendations ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("common.loading")}
                  </>
                ) : (
                  t("common.finish")
                )
              ) : (
                t("common.next")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
