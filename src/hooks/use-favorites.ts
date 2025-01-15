import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useFavorites = (sessionId: string | undefined) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('favorite_workouts')
          .select('id')
          .eq('session_id', sessionId)
          .maybeSingle();

        if (error) throw error;
        
        setIsFavorite(!!data);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [sessionId]);

  return { isFavorite, isLoading };
};