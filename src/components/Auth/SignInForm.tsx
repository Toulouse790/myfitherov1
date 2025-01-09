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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Erreur de connexion:", signInError);
        throw signInError;
      }

      if (data?.session) {
        console.log("Session créée avec succès:", data.session);
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate("/");
      } else {
        console.error("Pas de session créée");
        throw new Error("Impossible de créer une session");
      }
    } catch (err) {
      console.error("Erreur détaillée:", err);
      setError("Email ou mot de passe incorrect");
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect",
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