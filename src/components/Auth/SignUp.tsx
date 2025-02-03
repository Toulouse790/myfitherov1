import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { handleSignupError } from "@/utils/auth-errors";

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
      // 1. Vérifier si le pseudo existe déjà
      const { data: existingProfiles } = await supabase
        .from('profiles')
        .select('pseudo')
        .eq('pseudo', pseudo);

      if (existingProfiles && existingProfiles.length > 0) {
        toast({
          title: "Erreur",
          description: "Ce pseudo est déjà utilisé",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // 2. Créer le compte utilisateur
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pseudo: pseudo,
          }
        }
      });

      if (signUpError) {
        // Si l'utilisateur existe déjà, rediriger vers la page de connexion
        if (signUpError.message.includes("User already registered")) {
          toast({
            title: "Compte existant",
            description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          });
          navigate("/signin", { replace: true });
          return;
        }

        const errorMessage = handleSignupError(signUpError);
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive",
        });
        throw signUpError;
      }

      // 3. Attendre un court instant pour que le trigger crée le profil
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Mettre à jour le profil avec les informations supplémentaires
      if (signUpData?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ 
            pseudo: pseudo,
            username: pseudo,
            email: email 
          })
          .eq('id', signUpData.user.id);

        if (profileError) {
          console.error("Erreur mise à jour profil:", profileError);
          throw profileError;
        }

        toast({
          title: "Succès",
          description: "Votre compte a été créé avec succès",
        });

        // Redirection vers le questionnaire initial
        navigate("/initial-questionnaire", { replace: true });
      }
    } catch (error: any) {
      console.error("Erreur signup:", error);
      if (!error.message?.includes("User already registered")) {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue lors de l'inscription",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Créer un compte</h1>
          <p className="text-muted-foreground">
            Entrez vos informations pour créer votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="pseudo" className="text-sm font-medium">
              Pseudo
            </label>
            <Input
              id="pseudo"
              placeholder="Votre pseudo"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Création en cours..." : "Créer mon compte"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Déjà un compte?{" "}
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={() => navigate("/signin")}
            >
              Se connecter
            </Button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SignUp;