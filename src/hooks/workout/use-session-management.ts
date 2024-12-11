import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useSessionManagement = (sessionId: string | null) => {
  const [isCardio, setIsCardio] = useState(false);
  const { toast } = useToast();

  const checkSessionType = async (sessionId: string) => {
    try {
      console.log("Checking session type for:", sessionId);
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .select('type, exercises')
        .eq('id', sessionId)
        .single();

      if (error) {
        console.error('Error checking session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la session d'entraînement",
          variant: "destructive",
        });
        return;
      }

      console.log("Session data:", session);
      if (session?.type === 'cardio') {
        setIsCardio(true);
      }
    } catch (error) {
      console.error('Error in checkSessionType:', error);
    }
  };

  useEffect(() => {
    if (sessionId) {
      checkSessionType(sessionId);
    }
  }, [sessionId]);

  return { isCardio };
};