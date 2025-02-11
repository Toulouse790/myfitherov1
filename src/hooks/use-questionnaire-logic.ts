
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { QuestionnaireResponse, QuestionnaireStep } from "@/types/questionnaire";
import { validateStep } from "@/utils/questionnaire";
import { useQuestionnaireSubmission } from "./use-questionnaire-submission";

export const useQuestionnaireLogic = () => {
  const [step, setStep] = useState<QuestionnaireStep>(1);
  const [responses, setResponses] = useState<QuestionnaireResponse>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { submitQuestionnaire } = useQuestionnaireSubmission();

  const handleResponseChange = (field: keyof QuestionnaireResponse, value: any) => {
    setResponses(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = async () => {
    if (step < 7) {
      setStep(prev => (prev + 1) as QuestionnaireStep);
    } else if (step === 7) {
      try {
        await submitQuestionnaire(responses);
        toast({
          description: "Redirection vers l'accueil...",
        });
        navigate("/", { replace: true });
      } catch (error) {
        // Error already handled by submitQuestionnaire
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => (prev - 1) as QuestionnaireStep);
    }
  };

  return {
    step,
    responses,
    handleResponseChange,
    handleNext,
    handleBack,
    isStepValid: () => validateStep(step, responses),
  };
};
