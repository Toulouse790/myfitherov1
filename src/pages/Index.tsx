import { Header } from "@/components/Layout/Header";
import { WorkoutSuggestions } from "@/components/Dashboard/WorkoutSuggestions";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Brain, Activity, BarChart3, Dumbbell } from "lucide-react";
import { motion } from "framer-motion";

export default function Index() {
  const MotionCard = motion(Card);
  
  return (
    <Header>
      <div className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Créer ma séance */}
          <MotionCard 
            className="p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer bg-gradient-to-br from-primary/5 to-background"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Link to="/workout/generate" className="block">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm" />
                  <Brain className="w-8 h-8 md:w-10 md:h-10 text-primary relative" />
                </div>
                <div className="text-center">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">Créer ma séance</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Construisez votre séance personnalisée en choisissant parmi notre bibliothèque d'exercices
                  </p>
                </div>
              </div>
            </Link>
          </MotionCard>

          {/* Laisse-moi faire */}
          <MotionCard 
            className="p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Link to="/workouts" className="block">
              <div className="flex flex-col items-center gap-4">
                <Dumbbell className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                <div className="text-center">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">Laisse-moi faire</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Générez automatiquement une séance adaptée à votre historique d'entraînement
                  </p>
                </div>
              </div>
            </Link>
          </MotionCard>

          {/* Cardio */}
          <MotionCard 
            className="p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Link to="/cardio" className="block">
              <div className="flex flex-col items-center gap-4">
                <Activity className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                <div className="text-center">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">Cardio</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Choisissez parmi différents types d'exercices cardio pour votre entraînement
                  </p>
                </div>
              </div>
            </Link>
          </MotionCard>

          {/* Statistiques */}
          <MotionCard 
            className="p-4 md:p-6 hover:shadow-lg transition-all cursor-pointer md:col-span-2 lg:col-span-1"
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
          >
            <Link to="/stats" className="block">
              <div className="flex flex-col items-center gap-4">
                <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                <div className="text-center">
                  <h2 className="text-lg md:text-xl font-semibold mb-2">Statistiques</h2>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Suivez vos progrès et analysez vos performances d'entraînement
                  </p>
                </div>
              </div>
            </Link>
          </MotionCard>
        </div>

        <div className="mt-6">
          <WorkoutSuggestions />
        </div>
      </div>
    </Header>
  );
}