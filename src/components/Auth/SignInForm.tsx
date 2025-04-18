
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@/hooks/use-signin";
import { useNavigate } from "react-router-dom";
import { CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2 } from "lucide-react";
import { debugLogger } from "@/utils/debug-logger";
import { EmailInput } from "./SignInForm/EmailInput"; 
import { PasswordInput } from "./SignInForm/PasswordInput";
import { SubmitButton } from "./SignInForm/SubmitButton";
import { NavigationLinks } from "./SignInForm/NavigationLinks";
import { useLanguage } from "@/contexts/LanguageContext";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignIn, isLoading } = useSignIn();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      debugLogger.log("SignInForm", "Tentative de connexion avec:", { email });
      
      // Validation côté client
      if (!email || !password) {
        toast({
          variant: "destructive",
          title: "Erreur de saisie",
          description: "Veuillez remplir tous les champs",
        });
        return;
      }
      
      const success = await handleSignIn(email, password);
      
      if (success) {
        // Redirection vers la page d'accueil après connexion réussie
        debugLogger.log("SignInForm", "Connexion réussie, redirection vers l'accueil");
        navigate("/", { replace: true });
      } else {
        debugLogger.warn("SignInForm", "Échec de la connexion");
      }
    } catch (error) {
      debugLogger.error("SignInForm", "Erreur de connexion:", error);
      let errorMessage = "Email ou mot de passe incorrect.";
      
      if (error instanceof Error) {
        if (error.message.includes("Invalid login credentials")) {
          errorMessage = "Email ou mot de passe incorrect. Vérifiez vos identifiants.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage = "Votre email n'a pas été confirmé. Vérifiez votre boîte de réception.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage = "Trop de tentatives. Veuillez réessayer plus tard.";
        } else if (error.message.includes("User not found")) {
          errorMessage = "Aucun compte n'existe avec cet email. Voulez-vous vous inscrire?";
        }
      }
      
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: errorMessage,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <EmailInput email={email} onChange={setEmail} />
        <PasswordInput password={password} onChange={setPassword} />
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <SubmitButton isLoading={isLoading} />
        <NavigationLinks />
      </CardFooter>
    </form>
  );
};
