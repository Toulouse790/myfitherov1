import { Card } from "@/components/ui/card";
import { Bookmark, Dumbbell, Target, Zap, User, Heart, Scale, Beef } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

interface SuggestionProps {
  suggestion: {
    id: number | string;
    title: string;
    description: string;
    icon_name: string;
    type: string;
  };
  onClick: (type: string) => void;
}

const iconMap = {
  'Bookmark': Bookmark,
  'Target': Target,
  'Zap': Zap,
  'Dumbbell': Dumbbell,
  'User': User,
  'Heart': Heart,
  'Scale': Scale,
  'Beef': Beef
};

export const SuggestionsList = ({ suggestions, onSuggestionClick }: { 
  suggestions: Array<any>,
  onSuggestionClick: (type: string) => void 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSuggestionClick = async (type: string) => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour accéder aux entraînements",
        variant: "destructive",
      });
      return;
    }

    try {
      // Créer une nouvelle session d'entraînement
      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            user_id: user.id,
            status: 'in_progress',
            workout_type: type
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la création de la session:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la session d'entraînement",
          variant: "destructive",
        });
        return;
      }

      if (session) {
        navigate(`/workouts/exercise/next-workout?session=${session.id}`);
      }
    } catch (error) {
      console.error('Error creating workout session:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      {suggestions.map((suggestion) => {
        const IconComponent = iconMap[suggestion.icon_name as keyof typeof iconMap];
        return (
          <Card
            key={suggestion.id}
            className="p-3 cursor-pointer hover:bg-muted/50 transition-colors min-h-[64px]"
            onClick={() => handleSuggestionClick(suggestion.type)}
          >
            <div className="flex items-start space-x-3">
              <div className="p-2 rounded-lg bg-primary shrink-0">
                {IconComponent && <IconComponent className="w-5 h-5 text-primary-foreground" />}
              </div>
              <div className="space-y-1">
                <h3 className="text-[14px] font-medium leading-none">{suggestion.title}</h3>
                <p className="text-[12px] text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};