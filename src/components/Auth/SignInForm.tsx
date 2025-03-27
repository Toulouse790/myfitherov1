
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

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignIn, isLoading } = useSignIn();
  const navigate = useNavigate();
  const { toast } = useToast();

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
      toast({
        variant: "destructive",
        title: "Erreur de connexion",
        description: "Email ou mot de passe incorrect.",
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
