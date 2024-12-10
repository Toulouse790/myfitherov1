import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Exercise {
  id: string;
  name: string;
  muscle_group: string;
  defaultSets: number;
  defaultReps: number;
  image_url?: string;
  video_url?: string;
}

export const useExercises = (exerciseIds?: string[]) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching exercises with IDs:", exerciseIds);

        let query = supabase
          .from('unified_exercises')
          .select(`
            id, 
            name,
            muscle_group,
            image_url,
            video_url
          `)
          .eq('is_published', true)
          .order('muscle_group', { ascending: true });
        
        if (exerciseIds && exerciseIds.length > 0) {
          query = query.in('id', exerciseIds);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Error fetching exercises:', error);
          return;
        }

        if (data) {
          console.log('Fetched exercises data:', data);
          const formattedExercises = data.map(ex => ({
            id: ex.id,
            name: ex.name,
            muscle_group: ex.muscle_group,
            defaultSets: 3,
            defaultReps: 12,
            image_url: ex.image_url,
            video_url: ex.video_url
          }));
          setExercises(formattedExercises);
        }
      } catch (error) {
        console.error('Error in fetchExercises:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercises();
  }, [exerciseIds]);

  return { exercises, isLoading };
};