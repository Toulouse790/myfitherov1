import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Bookmark, Dumbbell, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

interface WorkoutSuggestion {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  type: string;
}

const iconMap = {
  'Bookmark': Bookmark,
  'Target': Target,
  'Zap': Zap,
  'Dumbbell': Dumbbell
};

export const WorkoutSuggestions = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [suggestions, setSuggestions] = useState<WorkoutSuggestion[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const { data, error } = await supabase
        .from('workout_suggestions')
        .select('*')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      if (data) {
        console.log("Suggestions récupérées:", data);
        setSuggestions(data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les suggestions d'entraînement",
        variant: "destructive",
      });
    }
  };

  const handleSuggestionClick = (type: string) => {
    switch (type) {
      case 'favorites':
        toast({
          title: "Bientôt disponible",
          description: "Cette fonctionnalité sera disponible prochainement",
        });
        break;
      case 'daily':
      case 'quick':
      case 'full_body':
        navigate("/workouts");
        break;
      default:
        console.warn('Type de suggestion non géré:', type);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Suggestions</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggestions.map((suggestion) => {
          const IconComponent = iconMap[suggestion.icon_name as keyof typeof iconMap];
          return (
            <Card
              key={suggestion.id}
              className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => handleSuggestionClick(suggestion.type)}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary">
                  {IconComponent && <IconComponent className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h3 className="font-medium">{suggestion.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </Card>
          )}
        )}
      </div>
    </div>
  );
};