import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { SignUpForm } from "./SignUpForm";
import { supabase } from "@/integrations/supabase/client";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes("Database error")) {
          errorMessage = "Erreur lors de la création du profil. Veuillez réessayer.";
        }
        
        toast({
          title: "Erreur lors de l'inscription",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      if (data) {
        toast({
          title: "Bienvenue !",
          description: `${username}, bienvenue dans cette belle aventure ! Configurons ensemble vos préférences.`,
          duration: 5000,
        });

        setTimeout(() => {
          navigate("/initial-questionnaire");
        }, 2000);
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription",
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
          username={username}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          onUsernameChange={setUsername}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};