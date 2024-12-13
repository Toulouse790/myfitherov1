import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CardioTimer } from "./CardioTimer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const CardioSession = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [exerciseName, setExerciseName] = useState<string>("");

  // Charger les détails de la session au montage
  useState(() => {
    const loadSession = async () => {
      if (!sessionId) return;

      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('exercises')
          .eq('id', sessionId)
          .single();

        if (error) throw error;
        if (data?.exercises?.[0]) {
          setExerciseName(data.exercises[0]);
        }
      } catch (error) {
        console.error('Error loading session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la session",
          variant: "destructive",
        });
      }
    };

    loadSession();
  }, [sessionId, toast]);

  const handleComplete = async () => {
    if (!sessionId || !user) return;

    try {
      await supabase
        .from('workout_sessions')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', sessionId);

      toast({
        title: "Session terminée !",
        description: "Votre session cardio a été enregistrée avec succès.",
      });
      
      navigate('/workouts');
    } catch (error) {
      console.error('Error completing session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de terminer la session",
        variant: "destructive",
      });
    }
  };

  if (!exerciseName) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <CardioTimer 
        exerciseName={exerciseName}
        onComplete={handleComplete}
      />
    </div>
  );
};