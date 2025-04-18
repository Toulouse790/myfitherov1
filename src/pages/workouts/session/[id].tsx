
import { Header } from "@/components/Layout/Header";
import { WorkoutSession } from "@/components/Workouts/WorkoutSession";
import { VerifyConnection } from "@/components/Workouts/VerifyConnection"; 
import { debugLogger } from "@/utils/debug-logger";
import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { RequireAuth } from "@/components/Auth/RequireAuth";
import { EmptySessionView } from "@/components/Workouts/WorkoutSession/EmptySessionView";

export default function WorkoutSessionPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [sessionExists, setSessionExists] = useState<boolean | null>(null);
  
  useEffect(() => {
    debugLogger.log("WorkoutSessionPage", "Rendu de la page de session d'entraînement avec ID:", id || "ID manquant");
    
    const checkSessionExists = async () => {
      if (!id || !user) {
        setSessionExists(false);
        setIsLoading(false);
        return;
      }
      
      try {
        // Vérifier si la session existe et a des exercices
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('id, exercises, status')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error("Erreur lors de la vérification de la séance:", error);
          setSessionExists(false);
        } else {
          // Vérifier si la séance a au moins un exercice
          const hasExercises = data.exercises && 
                              Array.isArray(data.exercises) && 
                              data.exercises.length > 0;
                              
          // Une session est valide si elle a des exercices et n'est pas terminée
          setSessionExists(hasExercises && data.status !== 'completed');
        }
      } catch (error) {
        console.error("Exception lors de la vérification de la séance:", error);
        setSessionExists(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSessionExists();
  }, [id, user]);

  // Redirection automatique si l'URL ne correspond pas au bon format
  if (window.location.pathname.startsWith('/workout-session/')) {
    const sessionId = window.location.pathname.split('/workout-session/')[1];
    debugLogger.log("WorkoutSessionPage", "Redirection depuis l'ancien format d'URL vers le nouveau", {
      old: window.location.pathname,
      new: `/workouts/session/${sessionId}`
    });
    return <Navigate to={`/workouts/session/${sessionId}`} replace />;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4 pt-20 flex justify-center">
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">
                {t("common.loading") || "Chargement..."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <RequireAuth>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4">
          <VerifyConnection />
          {sessionExists === false ? (
            <EmptySessionView />
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">
                {t("workouts.training_session") || "Séance d'entraînement"}
              </h1>
              <WorkoutSession sessionId={id} />
            </>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
