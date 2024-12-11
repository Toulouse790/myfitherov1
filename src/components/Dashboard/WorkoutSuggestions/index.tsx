import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Bookmark, Dumbbell, Target, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const WorkoutSuggestions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const suggestions = [
    {
      id: 1,
      title: "Séance favorite",
      description: "Reprendre une séance sauvegardée",
      icon_name: "Bookmark",
      type: "favorites"
    },
    {
      id: 2,
      title: "Séance du jour",
      description: "Séance adaptée à vos objectifs",
      icon_name: "Target",
      type: "daily"
    },
    {
      id: 3,
      title: "Séance rapide",
      description: "20-30 minutes d'entraînement",
      icon_name: "Zap",
      type: "quick"
    },
    {
      id: 4,
      title: "Full body",
      description: "Entraînement complet du corps",
      icon_name: "Dumbbell",
      type: "full_body"
    }
  ];

  const handleSuggestionClick = async (type: string) => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour créer une séance",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }

    try {
      if (type === 'favorites') {
        toast({
          title: "Bientôt disponible",
          description: "Cette fonctionnalité sera disponible prochainement",
        });
        return;
      }

      const { data: session, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          type: 'strength',
          status: 'in_progress'
        })
        .select()
        .single();

      if (error) throw error;

      if (session) {
        navigate(`/workout/${session.id}`);
      }
    } catch (error) {
      console.error('Error creating workout:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance",
        variant: "destructive",
      });
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
          );
        })}
      </div>
    </div>
  );
};

const iconMap = {
  'Bookmark': Bookmark,
  'Target': Target,
  'Zap': Zap,
  'Dumbbell': Dumbbell
};