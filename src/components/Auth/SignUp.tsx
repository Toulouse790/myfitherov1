import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "./SignUpForm";
import { useSignup } from "@/hooks/use-signup";
import { useToast } from "@/hooks/use-toast";

export const SignUp = () => {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const [username, setUsername] = useState("testuser");
  const { signup, isLoading } = useSignup();
  const { toast } = useToast();

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

    const { error } = await signup(email, password, username);
    
    if (error) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'inscription",
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