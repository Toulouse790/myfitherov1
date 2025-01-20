import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EmailInput } from "./SignInForm/EmailInput";
import { PasswordInput } from "./SignInForm/PasswordInput";
import { RememberMeCheckbox } from "./SignInForm/RememberMeCheckbox";
import { SubmitButton } from "./SignInForm/SubmitButton";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Tentative de connexion avec:", { email });
      
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Erreur Supabase:", signInError);
        throw signInError;
      }

      if (!data?.session) {
        console.error("Pas de session créée");
        throw new Error("Aucune session n'a été créée");
      }

      console.log("Connexion réussie, session:", data.session);
      
      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      // Redirection vers /workouts après une connexion réussie
      navigate("/workouts");

    } catch (err) {
      console.error("Erreur complète:", err);
      
      const errorMessage = err instanceof Error ? err.message : "Erreur de connexion";
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSignIn} className="space-y-6">
      <CardContent className="space-y-4">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Connexion
          </h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre compte
          </p>
          <p className="text-sm">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Créer un compte
            </Link>
          </p>
        </div>
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <EmailInput
            email={email}
            onChange={setEmail}
          />
          
          <PasswordInput
            password={password}
            onChange={setPassword}
          />
          
          <RememberMeCheckbox
            checked={rememberMe}
            onCheckedChange={setRememberMe}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <SubmitButton isLoading={isLoading} />
      </CardFooter>
    </form>
  );
};