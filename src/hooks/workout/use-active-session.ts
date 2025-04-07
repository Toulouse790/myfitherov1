
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { debugLogger } from "@/utils/debug-logger";

export const useActiveSession = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSession, setActiveSession] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  const checkActiveSession = async () => {
    if (!user) {
      setIsLoading(false);
      return null;
    }

    try {
      debugLogger.log("useActiveSession", "Vérification des sessions actives");
      
      // Modifié pour utiliser .select() au lieu de .single() afin de gérer plusieurs sessions
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress');
      
      if (error) {
        // Correction du problème de type: passer error.message comme chaîne et l'objet error comme données
        debugLogger.error("workouts.errors.activeSessionCheck", error.message, error);
        return null;
      }

      // Si plusieurs sessions actives sont trouvées, prendre la plus récente
      if (data && data.length > 0) {
        // Trier par date de création (la plus récente en premier)
        const sortedSessions = data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        debugLogger.log("useActiveSession", `${sortedSessions.length} sessions actives trouvées, utilisation de la plus récente`);
        return sortedSessions[0];
      }
      
      return null;
    } catch (error) {
      console.error("Erreur lors de la vérification des sessions actives:", error);
      return null;
    }
  };

  useEffect(() => {
    const loadActiveSession = async () => {
      setIsLoading(true);
      const session = await checkActiveSession();
      setActiveSession(session);
      setIsLoading(false);
    };

    if (user) {
      loadActiveSession();
    } else {
      setActiveSession(null);
      setIsLoading(false);
    }
  }, [user]);

  return {
    isLoading,
    activeSession,
    setActiveSession,
    checkActiveSession
  };
};
