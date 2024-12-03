import { useState } from "react";
import { Sparkles, Activity, Bookmark } from "lucide-react";
import { WorkoutCard } from "./WorkoutCard";
import { GenerateWorkoutDialog } from "./GenerateWorkoutDialog";

export const WorkoutSuggestions = () => {
  const [showDialog, setShowDialog] = useState(false);

  const suggestions = [
    {
      title: "Personnalisé",
      description: "Laissez notre IA vous aider à créer un entraînement",
      icon: <Sparkles className="w-5 h-5 text-white" />,
      onClick: () => setShowDialog(true)
    },
    {
      title: "Cardio",
      description: "Enregistrer une séance de cardio",
      icon: <Activity className="w-5 h-5 text-white" />
    },
    {
      title: "Favoris",
      description: "Choisi parmi vos entraînements sauvegardés",
      icon: <Bookmark className="w-5 h-5 text-white" />
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-lg sm:text-xl font-semibold text-white">
        Envie de quelque chose de différent?
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {suggestions.map((suggestion, index) => (
          <WorkoutCard
            key={index}
            title={suggestion.title}
            description={suggestion.description}
            icon={suggestion.icon}
            onClick={suggestion.onClick}
          />
        ))}
      </div>

      <GenerateWorkoutDialog 
        open={showDialog} 
        onOpenChange={setShowDialog}
      />
    </div>
  );
};