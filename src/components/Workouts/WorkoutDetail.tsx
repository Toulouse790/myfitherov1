import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ExerciseSets } from "./ExerciseSets";
import { Plus, Play } from "lucide-react";

export const WorkoutDetail = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isStarted, setIsStarted] = useState(false);
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

  const handleStartSession = () => {
    setIsStarted(true);
    toast({
      title: "Séance démarrée",
      description: "C'est parti ! Bon entraînement !",
    });
  };

  const handleAddSet = async (exerciseName: string) => {
    try {
      const { error } = await supabase
        .from('exercise_sets')
        .insert({
          session_id: sessionId,
          exercise_name: exerciseName,
          set_number: 1,
          reps: 12,
          weight: 20,
        });

      if (error) throw error;

      toast({
        title: "Série ajoutée",
        description: "Une nouvelle série a été ajoutée à l'exercice.",
      });

      // Refresh session data
      const { data, error: refreshError } = await supabase
        .from('workout_sessions')
        .select('*, exercise_sets(*)')
        .eq('id', sessionId)
        .single();

      if (refreshError) throw refreshError;
      setSession(data);

    } catch (error) {
      console.error('Error adding set:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la série",
        variant: "destructive",
      });
    }
  };

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

        {isStarted && (
          <Card>
            <div className="p-6 space-y-6">
              {session.exercises?.map((exercise: string, index: number) => (
                <div key={index} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{exercise}</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleAddSet(exercise)}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Ajouter une série
                    </Button>
                  </div>
                  <ExerciseSets
                    exercises={[exercise]}
                    sessionId={sessionId || null}
                    currentExerciseIndex={0}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default WorkoutDetail;