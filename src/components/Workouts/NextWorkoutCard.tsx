import { Card } from "@/components/ui/card";
import { SkipForward, RotateCcw, Send, Timer, Plus, Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exerciseImages } from "./data/exerciseImages";

const SAMPLE_EXERCISES = [
  "Rowing avec Haltères",
  "Tirage à la poulie barre en V",
  "Curl Biceps aux Haltères",
  "Développé Militaire",
  "Élévations Latérales",
  "Crunch",
  "Planche"
];

export const NextWorkoutCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCardClick = () => {
    navigate('/workouts/exercise/next-workout');
  };

  const handleCreateManual = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/workouts');
    toast({
      title: "Création manuelle",
      description: "Créez votre propre séance d'entraînement",
    });
  };

  return (
    <Card 
      className="w-full max-w-2xl mx-auto bg-gradient-to-br from-[#1E2330] to-[#252B3B] border-[#2A2F3F] overflow-hidden animate-fade-up cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative group"
      onClick={handleCardClick}
    >
      <div className="bg-gradient-to-r from-primary to-secondary text-white px-2 py-1 text-xs sm:text-sm font-medium flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Timer className="h-3 w-3 animate-pulse" />
          <span>Prochain entraînement (IA)</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-5 w-5 bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={handleCreateManual}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-primary transition-colors duration-300">
          Dos, Biceps, Épaules, Abdos
        </h2>
        
        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-300">
          <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full">
            <Timer className="w-3 h-3" />
            <span>61 mins</span>
          </div>
          <div className="hidden sm:block w-1 h-1 rounded-full bg-gray-500" />
          <div className="bg-white/5 px-2 py-0.5 rounded-full">
            {SAMPLE_EXERCISES.length} exercices
          </div>
        </div>
        
        <div className="space-y-2">
          {SAMPLE_EXERCISES.map((exerciseName, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-white">{exerciseName}</p>
                <p className="text-xs text-gray-400">3 séries • 12 répétitions</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-start gap-2 sm:gap-3">
          {[
            { icon: SkipForward },
            { icon: RotateCcw },
            { icon: Send }
          ].map(({ icon: Icon }, index) => (
            <button 
              key={index}
              className="text-gray-400 hover:text-primary transition-colors hover:scale-110 transform duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};