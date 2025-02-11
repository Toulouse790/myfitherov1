
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireResponse } from "@/types/questionnaire";
import { mapObjectiveToProfile } from "@/utils/questionnaire";

export const useQuestionnaireSubmission = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const submitQuestionnaire = async (responses: QuestionnaireResponse) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour soumettre le questionnaire",
        variant: "destructive",
      });
      throw new Error("Non authentifié");
    }

    try {
      toast({
        title: "Étape 1/2",
        description: "Enregistrement des réponses...",
      });

      // Update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          gender: responses.gender,
          height_cm: Number(responses.height),
          weight_kg: Number(responses.weight),
          main_objective: responses.objective ? mapObjectiveToProfile(responses.objective) : null
        }, {
          onConflict: 'id'
        });

      if (profileError) throw profileError;

      // Submit questionnaire responses
      const { error: questionnaireError } = await supabase
        .from("questionnaire_responses")
        .insert([{
          user_id: user.id,
          ...responses
        }]);

      if (questionnaireError) throw questionnaireError;

      toast({
        title: "Étape 2/2",
        description: "Réponses enregistrées avec succès",
      });

    } catch (error: any) {
      console.error('Error in submission process:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
      throw error;
    }
  };

  return { submitQuestionnaire };
};
