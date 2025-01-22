import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { PersonalizedRecommendations } from "@/components/Recommendations/PersonalizedRecommendations";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ActionButtons } from "@/components/Home/ActionButtons";
import { LoadingSpinner } from "@/components/Home/LoadingSpinner";

function Index() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      toast({
        title: "Accès refusé",
        description: "Vous devez être connecté pour accéder à cette page",
        variant: "destructive",
      });
      navigate("/sign-in");
    }
  }, [user, loading, navigate, toast]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }

  return (
    <Header>
      <main className="container mx-auto px-4 py-4 space-y-8 max-w-6xl">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4"
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mt-2">
            En route vers ton succès ! <span className="text-emerald">🚀</span>
          </h1>

          <ActionButtons />
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

export default Index;