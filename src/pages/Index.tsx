import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, ChartBar, Activity, Utensils } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateSession = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer une séance",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    navigate('/workouts');
  };

  const handleAIGeneration = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour utiliser la génération IA",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

    try {
      setIsLoading(true);
      const { data: preferences, error: prefError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefError) throw new Error("Impossible de récupérer vos préférences");

      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: { userPreferences: preferences }
      });

      if (error) throw error;

      navigate('/workout-generate', { state: { generatedWorkout: data } });
      toast({ title: "Programme généré !", description: "Votre programme personnalisé est prêt." });
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le programme pour le moment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStats = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour voir vos statistiques",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    navigate('/stats');
  };

  const handleTrainingSuggestions = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour voir les suggestions d'entraînement",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    navigate('/suggestions');
  };

  const handleMealSuggestions = () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour voir les suggestions de repas",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    navigate('/nutrition');
  };

  return (
    <Header>
      <main className="container mx-auto px-4 py-8 space-y-8 max-w-6xl">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            En route vers ton succès ! 🚀
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button 
              onClick={handleCreateSession}
              className="h-auto py-6 group hover:scale-[1.02] transition-all duration-300"
              variant="default"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Créer ma séance
            </Button>

            <Button 
              onClick={handleAIGeneration}
              variant="outline"
              className="h-auto py-6 hover:bg-primary/10 transition-all duration-300"
              size="lg"
              disabled={isLoading}
            >
              <Sparkles className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
              Laisse-moi faire
            </Button>

            <Button
              onClick={handleStats}
              variant="secondary"
              className="h-auto py-6 hover:bg-secondary/90 transition-all duration-300"
              size="lg"
            >
              <ChartBar className="w-5 h-5 mr-2" />
              Statistiques
            </Button>

            <Button
              onClick={handleTrainingSuggestions}
              variant="outline"
              className="h-auto py-6 hover:bg-primary/10 transition-all duration-300"
              size="lg"
            >
              <Activity className="w-5 h-5 mr-2" />
              Suggestions d'entraînement
            </Button>

            <Button
              onClick={handleMealSuggestions}
              variant="outline"
              className="h-auto py-6 hover:bg-primary/10 transition-all duration-300 sm:col-span-2 lg:col-span-1"
              size="lg"
            >
              <Utensils className="w-5 h-5 mr-2" />
              Suggestions de repas
            </Button>
          </div>
        </motion.section>

        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <WorkoutSuggestions showAllSuggestions={false} />
          <PersonalizedRecommendations />
        </motion.section>
      </main>
    </Header>
  );
}