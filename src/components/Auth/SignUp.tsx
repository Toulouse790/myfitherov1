import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const pseudo = formData.get('pseudo') as string;

    try {
      // Vérifier si l'email existe déjà
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        toast({
          title: "Erreur",
          description: "Cet email est déjà utilisé",
          variant: "destructive",
        });
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
        title: "Compte créé avec succès",
        description: "Vous allez être redirigé vers le questionnaire initial",
      });

      navigate("/initial-questionnaire");
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Créer un compte</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label htmlFor="pseudo" className="block text-sm font-medium mb-1">
              Pseudo
            </label>
            <input
              id="pseudo"
              name="pseudo"
              type="text"
              required
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white p-2 rounded hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? "Création en cours..." : "Créer un compte"}
          </button>
        </form>
      </div>
    </div>
  );
};