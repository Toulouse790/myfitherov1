import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
            age={responses.age}
            weight={responses.weight}
            height={responses.height}
            onAgeChange={(value) => handleResponseChange("age", value)}
            onWeightChange={(value) => handleResponseChange("weight", value)}
            onHeightChange={(value) => handleResponseChange("height", value)}
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
            workoutsPerWeek={responses.training_frequency}
            onWorkoutsPerWeekChange={(value) => handleResponseChange("training_frequency", value)}
            workoutDuration={responses.workout_duration}
            onWorkoutDurationChange={(value) => handleResponseChange("workout_duration", value)}
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
              Étape {step} sur 7
            </div>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
            >
              {step === 7 ? "Terminer" : "Suivant"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};