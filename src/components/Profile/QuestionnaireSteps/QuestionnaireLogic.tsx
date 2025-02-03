import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface QuestionnaireAnswers {
  age?: number;
  height?: number;
  weight?: number;
  goals?: string[];
  experience_level?: string;
  preferred_days?: string[];
  session_duration?: number;
  medical_conditions?: string;
}

const mapObjectiveToProfile = (objective: string): string => {
  const objectiveMap: { [key: string]: string } = {
    'weight_loss': 'perte_de_poids',
    'muscle_gain': 'prise_de_masse',
    'maintenance': 'maintenance'
  };
  return objectiveMap[objective] || objective;
};

export const useQuestionnaireLogic = () => {
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState<any>({});
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleResponseChange = (field: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
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
        return Array.isArray(responses.available_equipment) && responses.available_equipment.length > 0;
      case 7:
        return !!responses.diet_type;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (step < 7) {
      setStep(prev => prev + 1);
    } else if (step === 7) {
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour soumettre le questionnaire",
          variant: "destructive",
        });
        return;
      }

      try {
        toast({
          title: "Étape 1/3",
          description: "Enregistrement des réponses...",
        });

        console.log("Updating profile with data:", {
          id: user.id,
          gender: responses.gender,
          height_cm: Number(responses.height),
          weight_kg: Number(responses.weight),
          main_objective: mapObjectiveToProfile(responses.objective)
        });

        // First, update or create the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            gender: responses.gender,
            height_cm: Number(responses.height),
            weight_kg: Number(responses.weight),
            main_objective: mapObjectiveToProfile(responses.objective)
          }, {
            onConflict: 'id'
          });

        if (profileError) {
          console.error('Error updating profile:', profileError);
          throw new Error('Erreur lors de la mise à jour du profil');
        }

        // Then submit questionnaire responses
        const { error: questionnaireError } = await supabase
          .from("questionnaire_responses")
          .insert([{
            user_id: user.id,
            ...responses
          }]);

        if (questionnaireError) {
          console.error('Error submitting questionnaire:', questionnaireError);
          throw questionnaireError;
        }

        toast({
          title: "Étape 2/3",
          description: "Réponses enregistrées avec succès",
        });

        toast({
          title: "Étape 3/3",
          description: "Redirection vers l'accueil...",
        });

        navigate("/");
      } catch (error: any) {
        console.error('Error in submission process:', error);
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de l'enregistrement",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
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