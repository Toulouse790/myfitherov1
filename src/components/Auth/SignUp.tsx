import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "./SignUpForm";
import { useSignup } from "@/hooks/use-signup";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signup, isLoading } = useSignup();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await signup(email, password, username);
      if (error?.message.includes("User already registered")) {
        toast({
          title: "Compte existant",
          description: "Un compte existe déjà avec cet email. Redirection vers la page de connexion...",
          variant: "destructive",
        });
        setTimeout(() => navigate("/signin"), 2000);
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error?.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
        </CardHeader>
        <SignUpForm
          username={username}
          email={email}
          password={password}
          confirmPassword={confirmPassword}
          onUsernameChange={setUsername}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onConfirmPasswordChange={setConfirmPassword}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};