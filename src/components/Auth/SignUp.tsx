import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { SignUpForm } from "./SignUpForm";
import { useNavigate } from "react-router-dom";
import { handleSignupError } from "@/utils/auth-errors";
import { supabase } from "@/integrations/supabase/client";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!pseudo.trim()) {
        toast({
          title: "Erreur",
          description: "Le pseudo est requis",
          variant: "destructive",
        });
        return;
      }

      if (password.length < 6) {
        toast({
          title: "Erreur",
          description: "Le mot de passe doit contenir au moins 6 caractères",
          variant: "destructive",
        });
        return;
      }

      console.log("Tentative d'inscription avec:", { email, pseudo });

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pseudo: pseudo,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (signUpData?.user) {
        console.log("Inscription réussie, création du profil pour:", signUpData.user.id);
        
        // Create profile manually
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: signUpData.user.id,
            email: email,
            pseudo: pseudo,
            username: pseudo,
          });

        if (profileError) {
          console.error("Erreur lors de la création du profil:", profileError);
          throw profileError;
        }

        // Verify profile creation
        const { data: profileData, error: checkError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', signUpData.user.id)
          .single();

        if (checkError || !profileData) {
          console.error("Erreur lors de la vérification du profil:", checkError);
          throw new Error("Le profil n'a pas été créé correctement");
        }

        console.log("Profil créé avec succès:", profileData);

        toast({
          title: "Succès",
          description: "Inscription réussie! Vous allez être redirigé vers le questionnaire initial.",
        });

        // Ensure we're authenticated before redirecting
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Session active, redirection vers le questionnaire");
          navigate("/initial-questionnaire");
        } else {
          console.error("Pas de session active après l'inscription");
          throw new Error("Erreur d'authentification après l'inscription");
        }
      }
    } catch (error: any) {
      console.error("Erreur détaillée lors de l'inscription:", error);
      const errorMessage = handleSignupError(error);
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
        </CardHeader>
        <SignUpForm
          email={email}
          password={password}
          pseudo={pseudo}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onPseudoChange={setPseudo}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};