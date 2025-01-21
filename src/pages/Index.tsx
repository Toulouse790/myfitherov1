import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell, Sparkles, ChartBar } from "lucide-react";
import { Card } from "@/components/ui/card";
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
      
      // Récupération des préférences utilisateur
      const { data: preferences, error: prefError } = await supabase
        .from('questionnaire_responses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (prefError) {
        throw new Error("Impossible de récupérer vos préférences");
      }

      // Génération du programme
      const { data, error } = await supabase.functions.invoke('generate-workout', {
        body: { userPreferences: preferences }
      });

      if (error) throw error;

      // Navigation avec les données générées
      navigate('/workout-generate', { 
        state: { generatedWorkout: data } 
      });

      toast({
        title: "Programme généré !",
        description: "Votre programme personnalisé est prêt.",
      });

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

  return (
    <Header>
      <div className="container mx-auto px-4 py-8 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            En route vers ton succès ! 🚀
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-2 hover:border-primary/50 transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleCreateSession}
                className="flex-1 gap-2 h-16 text-lg group hover:scale-[1.02] transition-all duration-300"
                size="lg"
              >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                Créer ma séance
              </Button>
              <Button 
                onClick={handleAIGeneration}
                variant="outline"
                className="flex-1 gap-2 h-16 text-lg hover:bg-primary/10 transition-all duration-300"
                size="lg"
                disabled={isLoading}
              >
                <Sparkles className={`w-6 h-6 ${isLoading ? 'animate-spin' : 'animate-pulse'}`} />
                {isLoading ? 'Génération...' : 'Laisse-moi faire'}
              </Button>
              <Button
                onClick={handleStats}
                variant="secondary"
                className="flex-1 gap-2 h-16 text-lg hover:bg-secondary/90 transition-all duration-300"
                size="lg"
              >
                <ChartBar className="w-6 h-6" />
                Mes statistiques
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <Card className="p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Suggestions d'entraînement</h2>
            </div>
            <WorkoutSuggestions showAllSuggestions={false} />
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-all duration-300">
            <PersonalizedRecommendations />
          </Card>
        </motion.div>
      </div>
    </Header>
  );
}