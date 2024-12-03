import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ObjectiveStep } from "./QuestionnaireSteps/ObjectiveStep";
import { PersonalInfoStep } from "./QuestionnaireSteps/PersonalInfoStep";
import { TrainingFrequencyStep } from "./QuestionnaireSteps/TrainingFrequencyStep";
import { TrainingLocationStep } from "./QuestionnaireSteps/TrainingLocationStep";
import { ActivityLevelStep } from "./QuestionnaireSteps/ActivityLevelStep";
import { useNavigate } from "react-router-dom";

interface QuestionnaireData {
  objective: string;
  age: string;
  weight: string;
  height: string;
  workoutsPerWeek: string;
  workoutDuration: string;
  hasAllergies: boolean;
  allergies: string[];
  dietaryRestrictions: string[];
  trainingLocation: string;
  activityLevel: string;
}

export const InitialQuestionnaire = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    objective: "",
    age: "",
    weight: "",
    height: "",
    workoutsPerWeek: "",
    workoutDuration: "",
    hasAllergies: false,
    allergies: [],
    dietaryRestrictions: [],
    trainingLocation: "",
    activityLevel: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("userPreferences", JSON.stringify({
      workoutDuration: formData.workoutDuration,
      activityLevel: formData.activityLevel
    }));
    toast({
      title: "Profil complété !",
      description: "Vos préférences ont été enregistrées avec succès.",
    });
    navigate("/");
  };

  const updateFormData = (field: keyof QuestionnaireData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <ObjectiveStep
            objective={formData.objective}
            onObjectiveChange={(value) => updateFormData("objective", value)}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            age={formData.age}
            weight={formData.weight}
            height={formData.height}
            onAgeChange={(value) => updateFormData("age", value)}
            onWeightChange={(value) => updateFormData("weight", value)}
            onHeightChange={(value) => updateFormData("height", value)}
          />
        );
      case 3:
        return (
          <ActivityLevelStep
            activityLevel={formData.activityLevel}
            onActivityLevelChange={(value) => updateFormData("activityLevel", value)}
          />
        );
      case 4:
        return (
          <TrainingFrequencyStep
            workoutsPerWeek={formData.workoutsPerWeek}
            onWorkoutsPerWeekChange={(value) => updateFormData("workoutsPerWeek", value)}
            workoutDuration={formData.workoutDuration}
            onWorkoutDurationChange={(value) => updateFormData("workoutDuration", value)}
          />
        );
      case 5:
        return (
          <TrainingLocationStep
            trainingLocation={formData.trainingLocation}
            onTrainingLocationChange={(value) => updateFormData("trainingLocation", value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Questionnaire initial</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStep()}
            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Précédent
              </Button>
              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
                >
                  Suivant
                </Button>
              ) : (
                <Button type="submit">Terminer</Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};