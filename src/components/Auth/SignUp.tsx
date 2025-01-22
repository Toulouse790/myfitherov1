import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "./SignUpForm";
import { useSignup } from "@/hooks/use-signup";
import { useToast } from "@/hooks/use-toast";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signUp, isLoading } = useSignup();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Starting signup process...");
    
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

    await signUp({ 
      email, 
      password, 
      pseudo: username 
    });
  };

  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
        </CardHeader>
        <SignUpForm
          email={email}
          password={password}
          pseudo={username}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onPseudoChange={setUsername}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};