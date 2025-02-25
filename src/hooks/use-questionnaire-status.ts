
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        const cachedStatus = sessionStorage.getItem(`questionnaire_completed_${userId}`);
        
        if (cachedStatus) {
          setHasCompletedQuestionnaire(cachedStatus === 'true');
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
        sessionStorage.setItem(`questionnaire_completed_${userId}`, String(completed));
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
