
import React from "react";
import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { appCache } from "@/utils/cache";
import { useAuth } from "@/contexts/AuthContext";

interface RequireQuestionnaireProps {
  children: React.ReactNode;
}

export const RequireQuestionnaire: React.FC<RequireQuestionnaireProps> = ({ children }) => {
  const { user } = useAuth();
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkQuestionnaire = async () => {
      if (!user) {
        setHasCompletedQuestionnaire(false);
        setIsLoading(false);
        return;
      }

      // Vérifier dans le cache d'abord
      const cacheKey = `questionnaire_completed_${user.id}`;
      const cachedValue = appCache.get<boolean>(cacheKey);
      
      if (cachedValue !== null) {
        setHasCompletedQuestionnaire(cachedValue);
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Erreur lors de la vérification du questionnaire:', error);
          setHasCompletedQuestionnaire(false);
        } else {
          const completed = !!data;
          setHasCompletedQuestionnaire(completed);
          // Mettre en cache le résultat pour 15 minutes
          appCache.set(cacheKey, completed, 900);
        }
      } catch (error) {
        console.error('Erreur:', error);
        setHasCompletedQuestionnaire(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkQuestionnaire();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!hasCompletedQuestionnaire && user) {
    // Rediriger vers le questionnaire, en conservant la destination d'origine
    return <Navigate to="/initial-questionnaire" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
