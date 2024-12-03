import { Card } from "@/components/ui/card";
import { SkipForward, RotateCcw, Send } from "lucide-react";

const SAMPLE_EXERCISES = [
  "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
  "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
  "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
  "/lovable-uploads/e0d82da6-8cbf-4e9c-94f4-edc2eb4e4c1d.png",
];

export const NextWorkoutCard = () => {
  return (
    <Card className="w-full bg-[#1E2330] border-[#2A2F3F] overflow-hidden">
      <div className="bg-[#9BB537] text-white px-4 py-2 text-lg font-medium">
        Prochain entraînement
      </div>
      
      <div className="p-4 space-y-4">
        <h2 className="text-2xl font-bold text-white">
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
              className="aspect-square rounded-lg overflow-hidden bg-[#2A2F3F]"
            >
              <img 
                src={img} 
                alt={`Exercise ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        <div className="text-gray-300 text-sm">
          Rowing avec Haltères • Tirage à la poulie barre en V • Curl Biceps aux Haltères • Curl...
        </div>
        
        <div className="flex justify-start gap-6 pt-2">
          <button className="text-gray-300 hover:text-white transition-colors">
            <SkipForward className="w-6 h-6" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            <RotateCcw className="w-6 h-6" />
          </button>
          <button className="text-gray-300 hover:text-white transition-colors">
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </Card>
  );
};