import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface QuestionnaireResponses {
  gender: string;
  age: string;
  weight: string;
  height: string;
  objective: string;
  training_frequency: string;
  workout_duration: string;
  experience_level: string;
  available_equipment: string[];
  diet_type: string;
}

export const useQuestionnaireLogic = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [responses, setResponses] = useState<QuestionnaireResponses>({
    gender: "",
    age: "",
    weight: "",
    height: "",
    objective: "",
    training_frequency: "",
    workout_duration: "",
    experience_level: "",
    available_equipment: [],
    diet_type: "",
  });

  const handleResponseChange = (field: keyof QuestionnaireResponses, value: any) => {
    setResponses((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return responses.gender !== "";
      case 2:
        return (
          responses.age !== "" &&
          responses.weight !== "" &&
          responses.height !== ""
        );
      case 3:
        return responses.objective !== "";
      case 4:
        return (
          responses.training_frequency !== "" &&
          responses.workout_duration !== ""
        );
      case 5:
        return responses.experience_level !== "";
      case 6:
        return responses.available_equipment.length > 0;
      case 7:
        return responses.diet_type !== "";
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (step < 7) {
      setStep(step + 1);
    } else if (step === 7) {
      try {
        if (!user) {
          toast({
            title: "Erreur",
            description: "Vous devez être connecté pour continuer",
            variant: "destructive",
          });
          return;
        }

        const { error } = await supabase
          .from("questionnaire_responses")
          .insert([{
            user_id: user.id,
            ...responses
          }]);

        if (error) throw error;

        toast({
          title: "Configuration terminée !",
          description: "Vos préférences ont été enregistrées avec succès.",
        });

        navigate("/");
      } catch (error) {
        console.error("Error saving questionnaire:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de l'enregistrement.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return {
    step,
    responses,
    handleResponseChange,
    handleNext,
    handleBack,
    isStepValid,
  };
};