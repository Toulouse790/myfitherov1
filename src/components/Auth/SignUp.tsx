import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignUpForm } from "./SignUpForm";

export const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (email: string, password: string, pseudo: string) => {
    try {
      setLoading(true);

      // Vérifier d'abord si l'email existe
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast({
          title: "Email déjà utilisé",
          description: "Un compte existe déjà avec cet email. Veuillez vous connecter.",
          variant: "destructive",
        });
        navigate("/signin", { replace: true });
        return;
      }

      // Vérifier si le pseudo est déjà utilisé
      const { data: existingPseudo } = await supabase
        .from('profiles')
        .select('id')
        .eq('pseudo', pseudo)
        .single();

      if (existingPseudo) {
        toast({
          title: "Pseudo déjà utilisé",
          description: "Ce pseudo est déjà pris. Veuillez en choisir un autre.",
          variant: "destructive",
        });
        return;
      }

      // Procéder à l'inscription
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pseudo: pseudo,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (!user) throw new Error("No user returned after signup");

      // Attendre que le trigger crée le profil
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier que le profil a été créé
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Profile not created properly");
      }

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès.",
      });
      
      navigate("/initial-questionnaire", { replace: true });

    } catch (error: any) {
      console.error("Erreur signup:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return <SignUpForm onSubmit={handleSignUp} loading={loading} />;
};