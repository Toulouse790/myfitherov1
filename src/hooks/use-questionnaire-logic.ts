
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QuestionnaireResponse, QuestionnaireStep } from "@/types/questionnaire";
import { validateStep } from "@/utils/questionnaire";
import { useQuestionnaireSubmission } from "./use-questionnaire-submission";
import { appCache } from "@/utils/cache";
import { useAuth } from "@/hooks/use-auth";

export const useQuestionnaireLogic = () => {
  const [step, setStep] = useState<QuestionnaireStep>(1);
  const [responses, setResponses] = useState<QuestionnaireResponse>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { submitQuestionnaire } = useQuestionnaireSubmission();
  const { user } = useAuth();

  const handleResponseChange = (field: keyof QuestionnaireResponse, value: any) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (step < 7) {
      setStep(prev => (prev + 1) as QuestionnaireStep);
    } else if (step === 7 && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await submitQuestionnaire(responses);
        toast({
          description: "Redirection vers l'accueil...",
        });
        
        // Mettre à jour le cache immédiatement
        if (user?.id) {
          appCache.set(`questionnaire_completed_${user.id}`, true, 3600);
        }
        
        // Ajouter un délai avant la redirection
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 1000);
        
      } catch (error) {
        // Error already handled by submitQuestionnaire
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => (prev - 1) as QuestionnaireStep);
    }
  };

  const isStepValid = () => validateStep(step, responses);

  return {
    step,
    responses,
    isSubmitting,
    handleResponseChange,
    handleNext,
    handleBack,
    isStepValid,
  };
};
