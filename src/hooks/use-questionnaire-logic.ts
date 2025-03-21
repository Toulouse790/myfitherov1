
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QuestionnaireResponse, QuestionnaireStep } from "@/types/questionnaire";
import { validateStep, getValidationMessage } from "@/utils/questionnaire";
import { useQuestionnaireSubmission } from "./use-questionnaire-submission";
import { appCache } from "@/utils/cache";
import { useAuth } from "@/hooks/use-auth";

export const useQuestionnaireLogic = () => {
  const [step, setStep] = useState<QuestionnaireStep>(1);
  const [responses, setResponses] = useState<QuestionnaireResponse>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { submitQuestionnaire } = useQuestionnaireSubmission();
  const { user } = useAuth();

  const handleResponseChange = (field: keyof QuestionnaireResponse, value: any) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Effacer le message de validation lors de la modification
    setValidationMessage(null);
  };

  const handleNext = async () => {
    // Vérifier la validation
    const message = getValidationMessage(step, responses);
    if (message) {
      setValidationMessage(message);
      toast({
        title: "Validation",
        description: message,
        variant: "destructive",
      });
      return;
    }

    if (step < 7) {
      setStep(prev => (prev + 1) as QuestionnaireStep);
      setValidationMessage(null);
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
      setValidationMessage(null);
    }
  };

  const isStepValid = () => validateStep(step, responses);

  return {
    step,
    responses,
    isSubmitting,
    validationMessage,
    handleResponseChange,
    handleNext,
    handleBack,
    isStepValid,
  };
};
