import { supabase } from "@/integrations/supabase/client";

export const useExerciseFetching = () => {
  const fetchExercises = async () => {
    try {
      console.log("Fetching exercises from Supabase...");
      const { data, error } = await supabase
        .from('unified_exercises')
        .select('name')
        .eq('est_publié', true);

      if (error) {
        console.error('Error fetching exercises:', error);
        throw error;
      }

      console.log(`Successfully fetched ${data?.length} exercises`);
      return data?.map(exercise => exercise.name) || [];
    } catch (error) {
      console.error('Error in fetchExercises:', error);
      throw error;
    }
  };

  return { fetchExercises };
};