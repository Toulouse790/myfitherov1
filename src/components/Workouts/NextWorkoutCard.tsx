import { Card } from "@/components/ui/card";
import { SkipForward, RotateCcw, Send, Timer, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { exerciseImages } from "./data/exerciseImages";

const SAMPLE_EXERCISES = [
  "Rowing avec Haltères",
  "Tirage à la poulie barre en V",
  "Curl Biceps aux Haltères",
  "Développé Militaire"
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
      className="w-full bg-gradient-to-br from-[#1E2330] to-[#252B3B] border-[#2A2F3F] overflow-hidden animate-fade-up cursor-pointer hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative group"
      onClick={handleCardClick}
    >
      <div className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 text-sm font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer className="h-4 w-4 animate-pulse" />
          <span>Prochain entraînement (IA)</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 bg-background/50 backdrop-blur-sm hover:bg-background/80"
          onClick={handleCreateManual}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-6 space-y-6">
        <h2 className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
          Dos, Biceps, Épaules, Abdos
        </h2>
        
        <div className="flex items-center gap-3 text-gray-300">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
            <Timer className="w-4 h-4" />
            <span>61 mins</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
          <div className="bg-white/5 px-3 py-1 rounded-full">
            8 exercices
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {SAMPLE_EXERCISES.map((exerciseName, index) => (
            <div 
              key={index}
              className="aspect-square rounded-xl overflow-hidden bg-[#2A2F3F] hover:ring-2 hover:ring-primary transition-all duration-300 transform hover:scale-105"
            >
              <img 
                src={exerciseImages[exerciseName]} 
                alt={exerciseName}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        
        <div className="text-gray-400 text-sm line-clamp-2 bg-white/5 p-4 rounded-xl">
          Rowing avec Haltères • Tirage à la poulie barre en V • Curl Biceps aux Haltères • Curl Marteau • Développé Militaire • Élévations Latérales • Crunch • Planche
        </div>
        
        <div className="flex justify-start gap-6 pt-2">
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
              <Icon className="w-6 h-6" />
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};