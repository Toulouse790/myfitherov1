import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface QuestionnaireResponses {
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

export const INITIAL_RESPONSES: QuestionnaireResponses = {
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

export const useQuestionnaireLogic = () => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState<QuestionnaireResponses>(INITIAL_RESPONSES);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleResponseChange = (field: keyof QuestionnaireResponses, value: string) => {
    console.log(`Mise à jour du champ ${field} avec la valeur:`, value);
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const saveResponse = async (finalResponses: QuestionnaireResponses) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error("Erreur: Utilisateur non connecté");
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour continuer",
        variant: "destructive",
      });
      navigate("/signin");
      return;
    }

    console.log("Tentative de sauvegarde pour l'utilisateur:", user.id);
    console.log("Réponses finales:", finalResponses);

    // Save questionnaire responses
    const { data: questionnaireData, error: questionnaireError } = await supabase
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

    console.log("Questionnaire sauvegardé avec succès:", questionnaireData);

    // Save measurements
    const { data: measurementsData, error: measurementsError } = await supabase
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

    console.log("Mesures sauvegardées avec succès:", measurementsData);

    toast({
      title: "Configuration terminée",
      description: "Vos préférences ont été enregistrées avec succès !",
    });
    navigate("/");
  };

  const handleNext = async () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      await saveResponse(responses);
    }
  };

  const handleBack = () => {
    setStep(Math.max(1, step - 1));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return !!responses.gender;
      case 2:
        return !!responses.age && !!responses.weight && !!responses.height;
      case 3:
        return !!responses.objective;
      case 4:
        return !!responses.training_frequency && !!responses.workout_duration;
      case 5:
        return !!responses.experience_level;
      case 6:
        return !!responses.available_equipment;
      case 7:
        return !!responses.diet_type;
      default:
        return false;
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