import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { EmailInput } from "./SignInForm/EmailInput";
import { PasswordInput } from "./SignInForm/PasswordInput";
import { RememberMeCheckbox } from "./SignInForm/RememberMeCheckbox";
import { SubmitButton } from "./SignInForm/SubmitButton";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;

      navigate("/");
    } catch (err) {
      console.error("Erreur de connexion:", err);
      setError("Email ou mot de passe incorrect");
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