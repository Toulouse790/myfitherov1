import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const useSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const getErrorMessage = (error: AuthError) => {
    if (error instanceof AuthApiError) {
      switch (error.message) {
        case "Invalid login credentials":
          return "Email ou mot de passe incorrect";
        case "Email not confirmed":
          return "Veuillez confirmer votre email avant de vous connecter";
        default:
          return "Une erreur est survenue lors de la connexion";
      }
    }
    return error.message;
  };

  const handleSignIn = async (email: string, password: string, rememberMe: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("=== DÉBUT DE LA TENTATIVE DE CONNEXION ===");
      console.log({
        email: email,
        timestamp: new Date().toISOString(),
        location: window.location.href
      });

      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.error("=== ERREUR DE CONNEXION ===");
        console.error({
          message: signInError.message,
          code: signInError.status,
          name: signInError.name,
          timestamp: new Date().toISOString()
        });
        
        const errorMessage = getErrorMessage(signInError);
        setError(errorMessage);
        return;
      }

      console.log("=== CONNEXION RÉUSSIE ===");
      console.log({
        userId: data.session?.user.id,
        email: data.session?.user.email,
        aud: data.session?.user.aud,
        role: data.session?.user.role,
        timestamp: new Date().toISOString()
      });

      if (rememberMe && data.session) {
        console.log("=== SAUVEGARDE DE LA SESSION ===");
        console.log({
          userId: data.session.user.id,
          expiresAt: data.session.expires_at,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('myfithero-auth', JSON.stringify(data.session));
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur MyFitHero !",
      });

      const state = location.state as any;
      const workoutPlan = state?.workoutPlan;
      
      if (workoutPlan) {
        await handleWorkoutPlanCreation(data.session?.user.id, workoutPlan);
        return;
      }

      const from = state?.from?.pathname || "/";
      console.log("=== REDIRECTION ===");
      console.log({
        from: from,
        timestamp: new Date().toISOString()
      });
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("=== DÉTAILS DE L'ERREUR ===");
      console.error({
        message: error.message,
        code: error.code,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      
      setError("Une erreur inattendue est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkoutPlanCreation = async (userId: string | undefined, workoutPlan: any) => {
    console.log("=== CRÉATION DE LA SESSION D'ENTRAÎNEMENT ===");
    console.log({
      userId: userId,
      exercises: workoutPlan.exercises,
      planDetails: workoutPlan,
      timestamp: new Date().toISOString()
    });

    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert([{ 
        user_id: userId,
        type: 'strength',
        status: 'in_progress',
        exercises: workoutPlan.exercises.map((ex: any) => ex.name),
        target_duration_minutes: 45
      }])
      .select()
      .single();

    if (sessionError) {
      console.error("=== ERREUR CRÉATION SESSION ===");
      console.error({
        error: sessionError,
        timestamp: new Date().toISOString()
      });
      throw sessionError;
    }

    if (session) {
      console.log("=== SESSION CRÉÉE AVEC SUCCÈS ===");
      console.log({
        sessionId: session.id,
        userId: session.user_id,
        exercises: session.exercises,
        timestamp: new Date().toISOString()
      });
      navigate(`/workout/${session.id}`);
    }
  };

  return {
    isLoading,
    error,
    handleSignIn
  };
};
