import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const RequireQuestionnaire = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasQuestionnaire, setHasQuestionnaire] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkQuestionnaire = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("questionnaire_responses")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la vérification du questionnaire:", error);
          throw error;
        }
        
        setHasQuestionnaire(!!data);
        
        if (!data) {
          navigate("/initial-questionnaire");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du questionnaire:", error);
      } finally {
        setLoading(false);
      }
    };

    checkQuestionnaire();
  }, [user, navigate]);

  if (loading) {
    return <div>Vérification du profil...</div>;
  }

  return hasQuestionnaire ? <>{children}</> : null;
};