import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSignIn } from "@/hooks/use-signin";
import { useNavigate } from "react-router-dom";
import { CardContent, CardFooter } from "@/components/ui/card";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleSignIn, isLoading } = useSignIn();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleSignIn(email, password, true);
      navigate("/");
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Connexion en cours..." : "Se connecter"}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Pas encore de compte ?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto font-semibold hover:text-primary transition-colors"
            onClick={() => navigate("/signup")}
          >
            Inscrivez-vous
          </Button>
        </p>
      </CardFooter>
    </form>
  );
};