import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface SignUpFormProps {
  email: string;
  password: string;
  pseudo: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onPseudoChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
}

export function SignUpForm({
  email,
  password,
  pseudo,
  onEmailChange,
  onPasswordChange,
  onPseudoChange,
  onSubmit,
  isLoading
}: SignUpFormProps) {
  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pseudo">Pseudo</Label>
          <Input
            id="pseudo"
            type="text"
            placeholder="Votre pseudo"
            value={pseudo}
            onChange={(e) => onPseudoChange(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemple@email.com"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
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
            onChange={(e) => onPasswordChange(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Inscription en cours..." : "S'inscrire"}
        </Button>
        <p className="text-sm text-center text-muted-foreground">
          Déjà un compte ?{" "}
          <Link to="/signin" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}