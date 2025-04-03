
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Play, Clock, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useToast } from "@/hooks/use-toast";

interface LibraryWorkoutCardProps {
  template: any;
}

export function LibraryWorkoutCard({ template }: LibraryWorkoutCardProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { startWorkout } = useWorkoutSession();
  const { toast } = useToast();

  // Durée estimée en minutes (ajuster selon votre logique métier)
  const estimatedDuration = template.exercise_data?.length * 5 || 30;
  
  // Récupérer les groupes musculaires ciblés
  const muscleGroups = template.exercise_data
    ? [...new Set(template.exercise_data.map((ex: any) => ex.muscle_group))]
    : [];

  const handleStartWorkout = async () => {
    try {
      const exerciseNames = template.exercise_data?.map((ex: any) => ex.name) || [];
      
      if (exerciseNames.length === 0) {
        toast({
          title: t("workouts.emptyWorkoutError"),
          description: t("workouts.noExercisesInTemplate"),
          variant: "destructive",
        });
        return;
      }
      
      const session = await startWorkout(template.name, exerciseNames);
      
      if (session) {
        navigate(`/workouts/start/${session.id}`);
      }
    } catch (error) {
      console.error("Erreur lors du démarrage de l'entraînement:", error);
      toast({
        title: t("common.error"),
        description: t("workouts.startWorkoutError"),
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = () => {
    // Naviguer vers la page de détails du modèle (à implémenter si nécessaire)
    console.log("Voir les détails de:", template.id);
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="bg-muted p-4 flex items-center justify-center">
        <Dumbbell className="h-10 w-10 text-primary opacity-80" />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
        
        <div className="flex items-center text-muted-foreground text-sm mb-2">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>{estimatedDuration} min</span>
          {template.exercise_data && (
            <span className="ml-2">• {template.exercise_data.length} {t("workouts.exercises")}</span>
          )}
        </div>
        
        {muscleGroups.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {muscleGroups.map(group => (
              <span 
                key={group} 
                className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-0.5 rounded-full"
              >
                {group}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={handleViewDetails}>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleStartWorkout}>
          <Play className="h-4 w-4 mr-1" />
          {t("workouts.start")}
        </Button>
      </CardFooter>
    </Card>
  );
}
