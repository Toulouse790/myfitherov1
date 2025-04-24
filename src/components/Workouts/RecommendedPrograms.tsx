
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Clock, ArrowRight, Activity } from "lucide-react";
import { useWorkoutRecommendations } from "@/hooks/use-workout-recommendations";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useLanguage } from "@/contexts/LanguageContext";

export const RecommendedPrograms = () => {
  const { recommendations, isLoading } = useWorkoutRecommendations();
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const { startWorkout } = useWorkoutSession();
  const { t } = useLanguage();
  
  const displayedRecommendations = expanded 
    ? recommendations 
    : recommendations?.slice(0, 2);
  
  const handleStartWorkout = async (programId: string) => {
    try {
      // On récupère d'abord les exercices du programme
      const program = recommendations?.find(p => p.id === programId);
      
      if (program) {
        // Si on a les exercices, on utilise startWorkout du hook
        await startWorkout(programId, program.exercises?.map(e => e.name));
      } else {
        // Sinon on redirige directement vers la page de démarrage
        navigate(`/workouts/start/${programId}`);
      }
    } catch (error) {
      console.error("Erreur lors du démarrage de l'entraînement:", error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Programmes recommandés</h2>
        </div>
        <div className="grid gap-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 w-1/2 bg-muted rounded"></div>
                <div className="h-3 w-2/3 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 w-full bg-muted rounded mb-2"></div>
                <div className="h-4 w-3/4 bg-muted rounded"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 w-full bg-muted rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }
  
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Programmes recommandés</h2>
        </div>
        <Card>
          <CardContent className="pt-6 pb-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Dumbbell className="h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium">Pas encore de recommandations</h3>
              <p className="text-sm text-muted-foreground">
                Répondez à quelques questions pour obtenir un programme personnalisé
              </p>
              <Button 
                onClick={() => navigate('/workouts/generate')}
                className="mt-2"
              >
                Générer un programme
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Programmes recommandés</h2>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/workouts/generate')}
          size="sm"
        >
          Nouveau programme
        </Button>
      </div>
      
      <div className="grid gap-4">
        {displayedRecommendations?.map((program) => (
          <Card key={program.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{program.name}</CardTitle>
                <Badge variant={
                  program.difficulty === 'beginner' ? 'secondary' : 
                  program.difficulty === 'advanced' ? 'destructive' : 'default'
                }>
                  {t(`difficulty.${program.difficulty || 'intermediate'}`)}
                </Badge>
              </div>
              <CardDescription>
                {program.target_muscle_groups?.join(', ') || 'Programme complet'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{program.duration} min</span>
                </div>
                <div className="flex items-center gap-1">
                  <Dumbbell className="h-4 w-4" />
                  <span>{program.exercises?.length || 0} exercices</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-4 w-4" />
                  <span>~{program.calories_estimate || 0} kcal</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => handleStartWorkout(program.id)} 
                className="w-full"
              >
                Commencer l'entraînement
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {recommendations && recommendations.length > 2 && (
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? t('common.showLess') : t('common.showMore', { count: recommendations.length - 2 })}
        </Button>
      )}
    </div>
  );
};
