import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus, Dumbbell, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Index() {
  const navigate = useNavigate();

  const handleCreateSession = () => {
    navigate('/workouts');
  };

  const handleAIGeneration = () => {
    navigate('/workout-generate');
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
            Bienvenue sur votre espace d'entraînement
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
              >
                <Sparkles className="w-6 h-6 animate-pulse" />
                Générer avec l'IA
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