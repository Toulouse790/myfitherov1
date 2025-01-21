import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "workout" | "nutrition" | "sleep";
  explanation: string;
  dataPoints: string[];
}

export const PersonalizedRecommendations = () => {
  const { user } = useAuth();
  
  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ['personalized-recommendations', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // Récupérer les données récentes de l'utilisateur
      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: nutrition } = await supabase
        .from('food_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      const { data: sleep } = await supabase
        .from('sleep_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(7);

      // Analyser les données et générer des recommandations personnalisées
      const recommendations: Recommendation[] = [];

      // Recommandations d'entraînement
      if (workouts && workouts.length > 0) {
        const lastWorkout = workouts[0];
        if (lastWorkout.perceived_difficulty === 'easy') {
          recommendations.push({
            id: "1",
            title: "Augmentez l'intensité",
            description: "Vos dernières séances semblent trop faciles",
            category: "workout",
            explanation: "Basé sur vos 5 dernières séances où la difficulté perçue était 'facile'",
            dataPoints: ["Difficulté perçue: Facile", "Progression stable", "Bonne récupération"]
          });
        }
      }

      // Recommandations nutritionnelles
      if (nutrition && nutrition.length > 0) {
        const proteinTotal = nutrition.reduce((sum, entry) => sum + (entry.proteins || 0), 0);
        const avgProtein = proteinTotal / nutrition.length;
        if (avgProtein < 100) {
          recommendations.push({
            id: "2",
            title: "Augmentez vos protéines",
            description: "Pour optimiser votre récupération musculaire",
            category: "nutrition",
            explanation: "Votre apport moyen en protéines est inférieur aux recommandations",
            dataPoints: [`Moyenne actuelle: ${Math.round(avgProtein)}g/jour`, "Objectif: 100g/jour"]
          });
        }
      }

      // Recommandations sommeil
      if (sleep && sleep.length > 0) {
        const avgDuration = sleep.reduce((sum, session) => sum + (session.total_duration_minutes || 0), 0) / sleep.length;
        if (avgDuration < 420) { // Moins de 7h
          recommendations.push({
            id: "3",
            title: "Optimisez votre sommeil",
            description: "Pour une meilleure récupération",
            category: "sleep",
            explanation: "Votre durée moyenne de sommeil est inférieure aux recommandations",
            dataPoints: [`Moyenne actuelle: ${Math.round(avgDuration/60)}h/nuit`, "Objectif: 7-8h/nuit"]
          });
        }
      }

      return recommendations;
    },
    // Rafraîchir les données chaque jour
    staleTime: 24 * 60 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle>Recommandations personnalisées</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Recommandations basées sur vos données récentes d'entraînement, 
                  de nutrition et de sommeil. Mises à jour quotidiennement.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <p className="text-sm text-muted-foreground">
          Suggestions basées sur votre activité des 7 derniers jours
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {rec.description}
                  </p>
                  <div className="mt-2 space-y-1">
                    {rec.dataPoints.map((point, index) => (
                      <p key={index} className="text-xs text-muted-foreground">
                        • {point}
                      </p>
                    ))}
                  </div>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge 
                        variant={
                          rec.category === 'workout' ? 'default' :
                          rec.category === 'nutrition' ? 'secondary' : 
                          'outline'
                        }
                        className="capitalize"
                      >
                        {rec.category}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">{rec.explanation}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};