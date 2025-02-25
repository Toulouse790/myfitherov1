
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { appCache } from '@/utils/cache';

export const useQuestionnaireStatus = (userId?: string | null) => {
  const [hasCompletedQuestionnaire, setHasCompletedQuestionnaire] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkQuestionnaire = async () => {
      if (!userId) {
        setHasCompletedQuestionnaire(false);
        setIsLoading(false);
        return;
      }

      try {
        // Utiliser la mise en cache du navigateur pour éviter des appels répétés
        const cachedStatus = appCache.get<boolean>(`questionnaire_completed_${userId}`);
        
        if (cachedStatus !== null) {
          setHasCompletedQuestionnaire(cachedStatus);
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', userId)
          .maybeSingle();

        const completed = !!data;
        setHasCompletedQuestionnaire(completed);
        
        // Mettre en cache le résultat
        appCache.set(`questionnaire_completed_${userId}`, completed, 300); // Cache pour 5 minutes
      } catch (error) {
        console.error('Erreur lors de la vérification du questionnaire:', error);
        setHasCompletedQuestionnaire(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkQuestionnaire();
  }, [userId]);

  return { hasCompletedQuestionnaire, isLoading };
};
