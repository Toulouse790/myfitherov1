
import { Button } from "@/components/ui/button";
import { Play, Dumbbell, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface StartWorkoutStepProps {
  exerciseCount: number;
  onStartWorkout: () => void;
}

export const StartWorkoutStep = ({ exerciseCount, onStartWorkout }: StartWorkoutStepProps) => {
  const handleStartClick = () => {
    // Ajouter un log pour débugger
    console.log("Bouton C'est parti cliqué, appel de onStartWorkout");
    // Appel de la fonction passée en prop
    onStartWorkout();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center py-8 space-y-8 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Dumbbell className="w-10 h-10 text-primary" />
      </div>
      
      <div className="space-y-2 max-w-md">
        <h2 className="text-2xl font-bold">Votre entraînement est prêt !</h2>
        <p className="text-muted-foreground text-lg">
          Vous avez sélectionné {exerciseCount} exercices pour cette séance
        </p>
        
        <div className="flex flex-col items-center space-y-4 mt-6">
          <div className="bg-muted/40 p-4 rounded-lg w-full max-w-sm">
            <div className="flex items-center text-left mb-2">
              <CheckCircle className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium">Exercices personnalisés</span>
            </div>
            <div className="flex items-center text-left">
              <CheckCircle className="w-5 h-5 text-primary mr-2" />
              <span className="font-medium">Suivi de progression</span>
            </div>
          </div>
          
          <Button 
            size="lg"
            onClick={handleStartClick}
            className="mt-6 px-8 py-6 text-lg font-bold rounded-full shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 w-full sm:w-auto"
          >
            <Play className="w-6 h-6 mr-2" />
            C'est parti !
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
