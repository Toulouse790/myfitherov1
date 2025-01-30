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
      // Validation de base
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

      // 1. Inscription de l'utilisateur
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      // 2. Si l'inscription réussit, on met à jour le profil
      if (signUpData?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            pseudo: pseudo,
            username: pseudo,
            email: email 
          })
          .eq('id', signUpData.user.id);

        if (profileError) throw profileError;

        // 3. Notification de succès
        toast({
          title: "Succès",
          description: "Inscription réussie! Redirection vers le questionnaire initial...",
        });

        // 4. Redirection
        navigate("/initial-questionnaire");
      }
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error);
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