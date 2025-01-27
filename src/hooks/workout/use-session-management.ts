import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useSessionManagement = () => {
  const [isCardio, setIsCardio] = useState(false);

  useEffect(() => {
    const checkSessionType = async () => {
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('workout_type')
          .eq('status', 'in_progress')
          .single();

        if (error) throw error;

        setIsCardio(data?.workout_type === 'cardio');
      } catch (error) {
        console.error('Error checking session type:', error);
      }
    };

    checkSessionType();
  }, []);

  return { isCardio };
};