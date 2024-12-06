import { useState } from "react";
import { Sparkles, Activity, Bookmark } from "lucide-react";
import { WorkoutCard } from "./WorkoutCard";
import { GenerateWorkoutDialog } from "./GenerateWorkoutDialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const WorkoutSuggestions = () => {
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();

  const handleStartCardio = async () => {
    if (!user) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour démarrer une séance",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert([
          { 
            user_id: user.id,
            status: 'in_progress', 
            type: 'cardio',
            exercises: []
          }
        ])
        .select()
        .single();

      if (sessionError) throw sessionError;

      toast({
        title: "Séance de cardio démarrée",
        description: "Vous pouvez maintenant enregistrer votre activité cardio",
      });

      navigate(`/workouts/exercise/next-workout?session=${session.id}`);
    } catch (error) {
      console.error('Error starting cardio session:', error);
      toast({
        title: "Erreur",
        description: "Impossible de démarrer la séance de cardio",
        variant: "destructive",
      });
    }
  };

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
      icon: <Activity className="w-5 h-5 text-white" />,
      onClick: handleStartCardio
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