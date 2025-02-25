
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { SignUpForm } from "./SignUpForm";
import { useSignUp } from "@/hooks/use-signup";
import { useLanguage } from "@/contexts/LanguageContext";

export const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleSignUp } = useSignUp();
  const { t } = useLanguage();

  const onSubmit = async (email: string, password: string, pseudo: string) => {
    console.log('Début de la soumission du formulaire');
    setLoading(true);

    try {
      const success = await handleSignUp(email, password, pseudo);
      
      if (success) {
        console.log('Inscription réussie, redirection...');
        toast({
          title: t("auth.success"),
          description: t("auth.confirmEmail"),
        });
        // Redirection vers la page de confirmation
        navigate("/auth/confirm");
      }
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      toast({
        title: t("common.error"),
        description: error.message || t("auth.signUpError"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <SignUpForm onSubmit={onSubmit} loading={loading} />
    </div>
  );
};
