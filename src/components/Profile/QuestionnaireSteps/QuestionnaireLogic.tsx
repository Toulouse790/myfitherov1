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

export const QuestionnaireLogic = () => {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour soumettre le questionnaire",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Vérifier que le profil existe
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Profil utilisateur non trouvé");
      }

      toast({
        title: "Étape 1/3",
        description: "Enregistrement des réponses...",
      });

      // Insérer les réponses
      const { error } = await supabase
        .from("questionnaire_responses")
        .insert([{
          user_id: user.id,
          ...answers
        }]);

      if (error) throw error;

      toast({
        title: "Étape 2/3",
        description: "Réponses enregistrées avec succès",
      });

      toast({
        title: "Étape 3/3",
        description: "Redirection vers l'accueil...",
      });

      // Redirection vers la page d'accueil
      navigate("/");

    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'enregistrement",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAnswer = (key: keyof QuestionnaireAnswers, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return {
    answers,
    updateAnswer,
    handleSubmit,
    isSubmitting
  };
};