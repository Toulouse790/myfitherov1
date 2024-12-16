import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmailInput } from "./SignInForm/EmailInput";
import { PasswordInput } from "./SignInForm/PasswordInput";
import { RememberMeCheckbox } from "./SignInForm/RememberMeCheckbox";
import { SubmitButton } from "./SignInForm/SubmitButton";
import { NavigationLinks } from "./SignInForm/NavigationLinks";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Tentative de connexion pour:", email);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      console.log("Connexion réussie pour l'utilisateur:", {
        id: data.session?.user.id,
        email: data.session?.user.email
      });

      // Si remember me est coché, sauvegarder la session
      if (rememberMe && data.session) {
        console.log("Sauvegarde de la session pour:", data.session.user.id);
        localStorage.setItem('myfithero-auth', JSON.stringify(data.session));
      }

      toast({
        title: "Connexion réussie",
        description: "Bienvenue sur MyFitHero !",
      });

      // Récupérer le plan d'entraînement sauvegardé
      const state = location.state as any;
      const workoutPlan = state?.workoutPlan;
      
      if (workoutPlan) {
        console.log("Plan d'entraînement trouvé, création de la session...", {
          userId: data.session?.user.id,
          exercises: workoutPlan.exercises
        });

        const { data: session, error: sessionError } = await supabase
          .from('workout_sessions')
          .insert([
            { 
              user_id: data.session?.user.id,
              type: 'strength',
              status: 'in_progress',
              exercises: workoutPlan.exercises.map((ex: any) => ex.name),
              target_duration_minutes: 45
            }
          ])
          .select()
          .single();

        if (sessionError) {
          console.error('Erreur lors de la création de la session:', sessionError);
          throw sessionError;
        }

        if (session) {
          console.log("Session créée avec succès:", session);
          navigate(`/workout/${session.id}`);
          return;
        }
      }

      // Si pas de plan d'entraînement, redirection normale
      const from = state?.from?.pathname || "/";
      console.log("Redirection vers:", from);
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      let errorMessage = "Une erreur est survenue lors de la connexion";
      
      if (error.message.includes("Invalid login credentials")) {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.message.includes("Email not confirmed")) {
        errorMessage = "Veuillez confirmer votre email avant de vous connecter";
      }

      toast({
        title: "Erreur de connexion",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
      <div className="space-y-4">
        <EmailInput email={email} onChange={setEmail} />
        <PasswordInput password={password} onChange={setPassword} />
      </div>

      <RememberMeCheckbox checked={rememberMe} onCheckedChange={setRememberMe} />
      <SubmitButton isLoading={isLoading} />
      <NavigationLinks />
    </form>
  );
};