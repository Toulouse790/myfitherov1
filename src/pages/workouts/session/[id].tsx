
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
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('id, exercises')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error("Erreur lors de la vérification de la séance:", error);
          setSessionExists(false);
        } else {
          // Vérifier si la séance a au moins un exercice
          const hasExercises = data.exercises && Array.isArray(data.exercises) && data.exercises.length > 0;
          setSessionExists(hasExercises);
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
            <div className="pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="mb-4"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t("common.back") || "Retour"}
              </Button>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2 text-destructive">
                      {t("workouts.sessionNotFound") || "Séance non trouvée"}
                    </p>
                    <p className="text-muted-foreground mb-4">
                      {t("workouts.sessionNotFoundDesc") || "Cette séance d'entraînement ne contient aucun exercice ou n'existe pas."}
                    </p>
                    <Button onClick={() => window.location.href = '/workouts'}>
                      {t("workouts.backToWorkouts") || "Retour aux entraînements"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
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
