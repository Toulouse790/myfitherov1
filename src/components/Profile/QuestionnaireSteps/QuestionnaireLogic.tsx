
import React, { useState } from "react";
import { GenderStep } from "./GenderStep";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { ObjectiveStep } from "./ObjectiveStep";
import { TrainingFrequencyStep } from "./TrainingFrequencyStep";
import { ActivityLevelStep } from "./ActivityLevelStep";
import { TrainingLocationStep } from "./TrainingLocationStep";
import { DietTypeStep } from "./DietTypeStep";
import { SportSelectionStep } from "./SportSelectionStep";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface QuestionnaireLogicProps {
  onComplete: () => void;
}

export const QuestionnaireLogic: React.FC<QuestionnaireLogicProps> = ({ 
  onComplete 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const totalSteps = 8; // Ajout d'une étape
  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState({
    gender: "male",
    age: "25",
    height: "175",
    weight: "75",
    objective: "maintenance",
    training_frequency: "3",
    experience_level: "beginner",
    available_equipment: ["none"],
    workout_duration: "60",
    diet_type: "omnivore",
    sport_id: "",
    position_id: "",
  });

  const updateValue = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour soumettre le questionnaire",
          variant: "destructive",
        });
        return;
      }

      // Sauvegarde des réponses dans la base de données
      const { error } = await supabase
        .from("questionnaire_responses")
        .upsert({
          user_id: user.id,
          gender: values.gender,
          age: values.age,
          height: values.height,
          weight: values.weight,
          objective: values.objective,
          training_frequency: values.training_frequency,
          experience_level: values.experience_level,
          available_equipment: values.available_equipment,
          workout_duration: values.workout_duration,
          diet_type: values.diet_type,
          sport_id: values.sport_id,
          position_id: values.position_id,
        });

      if (error) throw error;

      // Mise à jour du profil utilisateur avec les infos principales
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          gender: values.gender,
          main_objective: values.objective,
          diet_type: values.diet_type,
          training_frequency: values.training_frequency,
          experience_level: values.experience_level,
          available_equipment: values.available_equipment,
          workout_duration: values.workout_duration,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      toast({
        title: "Questionnaire complété",
        description: "Vos réponses ont été enregistrées avec succès",
      });

      onComplete();
      navigate("/");
    } catch (error) {
      console.error("Erreur lors de la soumission du questionnaire:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de vos réponses",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <GenderStep
            onNext={handleNext}
            updateValue={updateValue}
            values={values}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            onNext={handleNext}
            onBack={handleBack}
            updateValue={updateValue}
            values={values}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 3:
        return (
          <ObjectiveStep
            onNext={handleNext}
            onBack={handleBack}
            updateValue={updateValue}
            values={values}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 4:
        return (
          <TrainingFrequencyStep
            onNext={handleNext}
            onBack={handleBack}
            updateValue={updateValue}
            values={values}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 5:
        return (
          <ActivityLevelStep
            onNext={handleNext}
            onBack={handleBack}
            updateValue={updateValue}
            values={values}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 6:
        return (
          <TrainingLocationStep
            onNext={handleNext}
            onBack={handleBack}
            updateValue={updateValue}
            values={values}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 7:
        return (
          <SportSelectionStep
            onNext={handleNext}
            onBack={handleBack}
            updateValue={updateValue}
            values={values}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 8:
        return (
          <DietTypeStep
            onNext={handleNext}
            onBack={handleBack}
            updateValue={updateValue}
            values={values}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      default:
        return null;
    }
  };

  return <div>{renderStep()}</div>;
};
