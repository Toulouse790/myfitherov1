import { Card } from "@/components/ui/card";
import { SkipForward, RotateCcw, Send, Timer } from "lucide-react";

const SAMPLE_EXERCISES = [
  "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
  "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
  "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
  "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
];

export const NextWorkoutCard = () => {
  return (
    <Card className="w-full bg-[#1E2330] border-[#2A2F3F] overflow-hidden animate-fade-in">
      <div className="bg-[#9BB537] text-white px-4 py-2 text-lg font-medium flex items-center justify-between">
        <span>Prochain entraînement</span>
        <Timer className="h-5 w-5" />
      </div>
      
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold text-white hover-scale transition-transform">
          Dos, Biceps, Épaules, Abdos
        </h2>
        
        <div className="flex items-center gap-2 text-gray-300">
          <span>61 mins</span>
          <span>•</span>
          <span>8 exercices</span>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {SAMPLE_EXERCISES.map((img, index) => (
            <div 
              key={index}
              className="aspect-square rounded-lg overflow-hidden bg-[#2A2F3F] hover:ring-2 hover:ring-primary transition-all duration-200"
            >
              <img 
                src={img} 
                alt={`Exercise ${index + 1}`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
        
        <div className="text-gray-300 text-sm line-clamp-2">
          Rowing avec Haltères • Tirage à la poulie barre en V • Curl Biceps aux Haltères • Curl Marteau • Développé Militaire • Élévations Latérales • Crunch • Planche
        </div>
        
        <div className="flex justify-start gap-6 pt-2">
          <button className="text-gray-300 hover:text-white transition-colors hover:scale-110 transform duration-200">
            <SkipForward className="w-6 h-6" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors hover:scale-110 transform duration-200">
            <RotateCcw className="w-6 h-6" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors hover:scale-110 transform duration-200">
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Card>
  );
};