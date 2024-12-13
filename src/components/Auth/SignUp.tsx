import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { SignUpForm } from "./SignUpForm";
import { useSignup } from "@/hooks/use-signup";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signup, isLoading } = useSignup();
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

    const { error: signupError, data } = await signup(email, password, username);
    
    if (signupError) {
      console.error("Signup error:", signupError);
      toast({
        title: "Erreur",
        description: signupError.message || "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      return;
    }

    // Mise à jour du profil avec le nom d'utilisateur
    if (data?.user) {
      console.log("Updating profile for user:", data.user.id);
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ 
          id: data.user.id,
          username: username,
          updated_at: new Date().toISOString()
        });

      if (updateError) {
        console.error('Error updating profile:', updateError);
        toast({
          title: "Attention",
          description: "Votre compte a été créé mais une erreur est survenue lors de la mise à jour du profil",
          variant: "destructive",
        });
      } else {
        console.log("Profile updated successfully");
      }
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