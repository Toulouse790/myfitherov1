import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Bookmark, Dumbbell, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface SuggestionType {
  title: string;
  description: string;
  icon: JSX.Element;
  onClick?: () => void;
}

export const WorkoutSuggestions = () => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const suggestions: SuggestionType[] = [
    {
      title: "Favoris",
      description: "Choisi parmi vos entraînements sauvegardés",
      icon: <Bookmark className="w-5 h-5 text-white" />,
      onClick: () => {
        toast({
          title: "Bientôt disponible",
          description: "Cette fonctionnalité sera disponible prochainement",
        });
      }
    },
    {
      title: "Programme du jour",
      description: "Suivez votre programme personnalisé",
      icon: <Target className="w-5 h-5 text-white" />,
      onClick: () => navigate("/workouts")
    },
    {
      title: "Quick Workout",
      description: "Séance rapide de 20 minutes",
      icon: <Zap className="w-5 h-5 text-white" />,
      onClick: () => navigate("/workouts")
    },
    {
      title: "Full Body",
      description: "Entraînement complet du corps",
      icon: <Dumbbell className="w-5 h-5 text-white" />,
      onClick: () => navigate("/workouts")
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suggestions</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggestions.map((suggestion, index) => (
          <Card
            key={index}
            className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
            onClick={suggestion.onClick}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary">
                {suggestion.icon}
              </div>
              <div>
                <h3 className="font-medium">{suggestion.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};