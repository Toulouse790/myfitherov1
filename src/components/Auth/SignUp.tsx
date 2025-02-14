
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
    console.log('Début de la soumission du formulaire');
    setLoading(true);

    try {
      const success = await handleSignUp(email, password, pseudo);
      
      if (success) {
        console.log('Inscription réussie, redirection...');
        toast({
          title: "Inscription réussie",
          description: "Vous allez être redirigé vers le questionnaire initial",
        });
        navigate("/initial-questionnaire", { replace: true });
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return <SignUpForm onSubmit={onSubmit} loading={loading} />;
};
