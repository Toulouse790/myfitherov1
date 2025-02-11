
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const RequireQuestionnaire = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [hasQuestionnaire, setHasQuestionnaire] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Liste des routes autorisées sans questionnaire
  const allowedRoutes = [
    '/initial-questionnaire',
    '/signin',
    '/signup',
    '/auth',
    '/profile'
  ];

  useEffect(() => {
    const checkQuestionnaire = async () => {
      if (!user) {
        console.log("No user found, skipping questionnaire check");
        setLoading(false);
        return;
      }

      // Si la route actuelle est autorisée, on ne vérifie pas le questionnaire
      if (allowedRoutes.includes(location.pathname)) {
        setLoading(false);
        return;
      }

      try {
        console.log("Checking questionnaire for user:", user.id);
        const { data, error } = await supabase
          .from("questionnaire_responses")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erreur lors de la vérification du questionnaire:", error);
          toast({
            title: "Erreur",
            description: "Impossible de vérifier le statut du questionnaire",
            variant: "destructive",
          });
          throw error;
        }
        
        const hasCompletedQuestionnaire = !!data;
        console.log("Questionnaire status:", hasCompletedQuestionnaire);
        setHasQuestionnaire(hasCompletedQuestionnaire);
        
        if (!hasCompletedQuestionnaire && !allowedRoutes.includes(location.pathname)) {
          console.log("Redirecting to questionnaire");
          toast({
            title: "Questionnaire requis",
            description: "Veuillez compléter le questionnaire initial pour accéder à cette page",
          });
          navigate("/initial-questionnaire");
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du questionnaire:", error);
      } finally {
        setLoading(false);
      }
    };

    checkQuestionnaire();
  }, [user, navigate, toast, location.pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Vérification du profil...</p>
        </div>
      </div>
    );
  }

  // Si la route est autorisée ou si l'utilisateur a complété le questionnaire
  if (allowedRoutes.includes(location.pathname) || hasQuestionnaire) {
    return <>{children}</>;
  }

  return null;
};
