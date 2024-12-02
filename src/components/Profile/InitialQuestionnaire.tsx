import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ObjectiveStep } from "./QuestionnaireSteps/ObjectiveStep";
import { PersonalInfoStep } from "./QuestionnaireSteps/PersonalInfoStep";
import { TrainingFrequencyStep } from "./QuestionnaireSteps/TrainingFrequencyStep";

interface QuestionnaireData {
  objective: string;
  age: string;
  weight: string;
  height: string;
  workoutsPerWeek: string;
  hasAllergies: boolean;
  allergies: string[];
  dietaryRestrictions: string[];
}

export const InitialQuestionnaire = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<QuestionnaireData>({
    objective: "",
    age: "",
    weight: "",
    height: "",
    workoutsPerWeek: "",
    hasAllergies: false,
    allergies: [],
    dietaryRestrictions: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profil complété !",
      description: "Vos préférences ont été enregistrées avec succès.",
    });
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
          <TrainingFrequencyStep
            workoutsPerWeek={formData.workoutsPerWeek}
            onWorkoutsPerWeekChange={(value) => updateFormData("workoutsPerWeek", value)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
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
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
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
  );
};