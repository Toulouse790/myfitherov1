import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { CardContent, CardFooter } from "@/components/ui/card";

interface SignUpFormProps {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const SignUpForm = ({
  username,
  email,
  password,
  confirmPassword,
  onUsernameChange,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
  isLoading,
}: SignUpFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Nom d'utilisateur</Label>
          <Input
            id="username"
            type="text"
            placeholder="Votre nom d'utilisateur"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
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
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
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
};