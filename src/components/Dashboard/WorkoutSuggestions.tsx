import { Card } from "@/components/ui/card";
import { Sparkles, Activity, Bookmark } from "lucide-react";

const suggestions = [
  {
    title: "Personnalisé",
    description: "Laissez notre IA vous aider à créer un entraînement",
    icon: <Sparkles className="w-6 h-6 text-white" />,
    bgColor: "bg-[#2A2F3F]"
  },
  {
    title: "Cardio",
    description: "Enregistrer une séance de cardio",
    icon: <Activity className="w-6 h-6 text-white" />,
    bgColor: "bg-[#2A2F3F]"
  },
  {
    title: "Favoris",
    description: "Choisi parmi vos entraînements sauvegardés",
    icon: <Bookmark className="w-6 h-6 text-white" />,
    bgColor: "bg-[#2A2F3F]"
  }
];

export const WorkoutSuggestions = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-white">Envie de quelque chose de différent?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {suggestions.map((suggestion, index) => (
          <Card 
            key={index}
            className={`${suggestion.bgColor} p-4 cursor-pointer hover:opacity-90 transition-opacity`}
          >
            <div className="space-y-2">
              <div className="rounded-full bg-[#1E2330] w-12 h-12 flex items-center justify-center">
                {suggestion.icon}
              </div>
              <h3 className="text-white font-medium">{suggestion.title}</h3>
              <p className="text-gray-400 text-sm">{suggestion.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};