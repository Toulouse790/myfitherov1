import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const RequireQuestionnaire = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkQuestionnaire = async () => {
      if (!user) {
        navigate("/signin");
        return;
      }

      const { data } = await supabase
        .from("questionnaire_responses")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!data) {
        navigate("/initial-questionnaire");
      }
      setLoading(false);
    };

    checkQuestionnaire();
  }, [user, navigate]);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return <>{children}</>;
};