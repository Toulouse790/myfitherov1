import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleAuthError } from "@/utils/auth-errors";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Erreur de connexion:", error);
        const errorMessage = handleAuthError(error);
        toast({
          title: "Erreur de connexion",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      console.log("Connexion réussie, session:", data.session);
      
      // Vérifier si l'utilisateur a déjà répondu au questionnaire nutritionnel
      const { data: nutritionPrefs, error: prefsError } = await supabase
        .from('user_nutrition_preferences')
        .select('id')
        .eq('user_id', data.session?.user.id)
        .single();

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté",
      });

      if (!nutritionPrefs) {
        // Si pas de préférences nutritionnelles, rediriger vers le questionnaire initial
        navigate("/initial-questionnaire");
      } else {
        // Sinon, rediriger vers la page de nutrition
        navigate("/nutrition");
      }

    } catch (err) {
      console.error("Erreur complète:", err);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full sm:w-[400px]">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
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
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Connexion..." : "Se connecter"}
      </Button>
    </form>
  );
};