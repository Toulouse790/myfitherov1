
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QuestionnaireResponse } from "@/types/questionnaire";
import { mapObjectiveToProfile } from "@/utils/questionnaire";
import { appCache } from "@/utils/cache";

export const useQuestionnaireSubmission = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

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

      // Update profile with all the information
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          gender: responses.gender,
          age: responses.age ? Number(responses.age) : null,
          height_cm: responses.height ? Number(responses.height) : null,
          weight_kg: responses.weight ? Number(responses.weight) : null,
          experience_level: responses.experience_level || null,
          training_frequency: responses.training_frequency || null,
          workout_duration: responses.workout_duration || '60',
          available_equipment: responses.available_equipment || [],
          diet_type: responses.diet_type || 'omnivore',
          main_objective: responses.objective ? mapObjectiveToProfile(responses.objective) : null,
          objectives: responses.objectives || []
        }, {
          onConflict: 'id'
        });

      if (profileError) throw profileError;

      // Store full questionnaire responses for history
      const { error: questionnaireError } = await supabase
        .from("questionnaire_responses")
        .insert([{
          user_id: user.id,
          ...responses
        }]);

      if (questionnaireError) throw questionnaireError;

      // Mettre à jour le cache immédiatement après la soumission réussie
      appCache.set(`questionnaire_completed_${user.id}`, true, 3600);

      toast({
        title: "Étape 2/2",
        description: "Réponses enregistrées avec succès",
      });

      // Rediriger vers le handler de complétion du questionnaire
      navigate("/questionnaire-complete", { 
        state: { returnTo: "/" },
        replace: true 
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
