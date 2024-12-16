import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExerciseSets } from "./ExerciseSets";

export const WorkoutDetail = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*, exercise_sets(*)')
          .eq('id', sessionId)
          .single();

        if (error) throw error;

        console.log("Session data:", data);
        setSession(data);
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la séance",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchSession();
    }
  }, [sessionId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4">
          <Card className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Séance introuvable</h2>
            <p className="text-muted-foreground mb-4">
              Cette séance n'existe pas ou a été supprimée.
            </p>
            <Button onClick={() => window.history.back()}>Retour</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Séance d'entraînement</h1>
          <Button variant="outline" onClick={() => window.history.back()}>
            Retour
          </Button>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            {session.exercises?.map((exercise: string, index: number) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold">{exercise}</h3>
                <ExerciseSets
                  exercises={[exercise]}
                  sessionId={sessionId || null}
                  currentExerciseIndex={0}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default WorkoutDetail;