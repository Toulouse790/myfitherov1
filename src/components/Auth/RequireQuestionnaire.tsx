
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface RequireQuestionnaireProps {
  children: React.ReactNode;
}

export const RequireQuestionnaire: React.FC<RequireQuestionnaireProps> = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState(false);

  useEffect(() => {
    const checkQuestionnaire = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("questionnaire_responses")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la vérification du questionnaire:", error);
          setLoading(false);
          return;
        }

        setHasCompletedQuestionnaire(!!data);
      } catch (error) {
        console.error("Erreur lors de la vérification du questionnaire:", error);
      } finally {
        setLoading(false);
      }
    };

    checkQuestionnaire();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user && !hasCompletedQuestionnaire) {
    navigate("/initial-questionnaire");
    return null;
  }

  return <>{children}</>;
};
