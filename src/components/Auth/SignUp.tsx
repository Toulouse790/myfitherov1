import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SignUpForm } from "./SignUpForm";
import { useSignUp } from "@/hooks/use-signup";

export const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleSignUp } = useSignUp();

  const onSubmit = async (email: string, password: string, pseudo: string) => {
    setLoading(true);

    try {
      const success = await handleSignUp(email, password, pseudo);
      
      if (success) {
        // Si l'inscription et la connexion réussissent, rediriger vers le questionnaire
        navigate("/initial-questionnaire");
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return <SignUpForm onSubmit={onSubmit} loading={loading} />;
};