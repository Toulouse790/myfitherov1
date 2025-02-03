import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SignUpForm } from "./SignUpForm";

export const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (email: string, password: string, pseudo: string) => {
    setLoading(true);

    try {
      // Vérifier si l'email existe déjà
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingUser) {
        toast({
          title: "Erreur",
          description: "Cet email est déjà utilisé",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Créer le nouvel utilisateur
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            pseudo: pseudo,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Attendre que le trigger crée le profil
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Vérifier que le profil a été créé
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', authData.user?.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Erreur lors de la création du profil");
      }

      toast({
        title: "Étape 1/4",
        description: "Création du compte réussie",
      });

      toast({
        title: "Étape 2/4",
        description: "Profil créé avec succès",
      });

      toast({
        title: "Étape 3/4",
        description: "Redirection vers le questionnaire...",
      });

      // Redirection vers le questionnaire initial après création réussie
      navigate("/initial-questionnaire");

      toast({
        title: "Étape 4/4",
        description: "Vous pouvez maintenant remplir le questionnaire",
      });

    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return <SignUpForm onSubmit={handleSubmit} loading={loading} />;
};