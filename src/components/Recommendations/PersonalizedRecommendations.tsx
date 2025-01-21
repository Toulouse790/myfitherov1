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
  type: "improvement" | "positive";
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

      const recommendations: Recommendation[] = [];

      // Recommandations d'entraînement
      if (workouts && workouts.length > 0) {
        const lastWorkout = workouts[0];
        const workoutsThisWeek = workouts.length;
        
        if (workoutsThisWeek >= 3) {
          recommendations.push({
            id: "workout-positive",
            title: "Excellente régularité !",
            description: "Vous maintenez un rythme d'entraînement constant",
            category: "workout",
            type: "positive",
            explanation: "Continuez sur cette lancée pour optimiser vos résultats",
            dataPoints: [`${workoutsThisWeek} séances cette semaine`, "Régularité maintenue"]
          });
        } else if (lastWorkout.perceived_difficulty === 'easy') {
          recommendations.push({
            id: "workout-improvement",
            title: "Augmentez l'intensité",
            description: "Vos dernières séances semblent trop faciles",
            category: "workout",
            type: "improvement",
            explanation: "Basé sur vos 5 dernières séances où la difficulté perçue était 'facile'",
            dataPoints: ["Difficulté perçue: Facile", "Progression possible", "Bonne récupération"]
          });
        }
      }

      // Recommandations nutritionnelles
      if (nutrition && nutrition.length > 0) {
        const proteinTotal = nutrition.reduce((sum, entry) => sum + (entry.proteins || 0), 0);
        const avgProtein = proteinTotal / nutrition.length;
        
        if (avgProtein >= 100) {
          recommendations.push({
            id: "nutrition-positive",
            title: "Excellent apport en protéines !",
            description: "Vous atteignez vos objectifs protéiques",
            category: "nutrition",
            type: "positive",
            explanation: "Un apport suffisant en protéines est essentiel pour la récupération",
            dataPoints: [`Moyenne actuelle: ${Math.round(avgProtein)}g/jour`, "Objectif atteint !"]
          });
        } else {
          recommendations.push({
            id: "nutrition-improvement",
            title: "Augmentez vos protéines",
            description: "Pour optimiser votre récupération musculaire",
            category: "nutrition",
            type: "improvement",
            explanation: "Votre apport moyen en protéines est inférieur aux recommandations",
            dataPoints: [`Moyenne actuelle: ${Math.round(avgProtein)}g/jour`, "Objectif: 100g/jour"]
          });
        }
      }

      // Recommandations sommeil
      if (sleep && sleep.length > 0) {
        const avgDuration = sleep.reduce((sum, session) => sum + (session.total_duration_minutes || 0), 0) / sleep.length;
        
        if (avgDuration >= 420) { // 7h ou plus
          recommendations.push({
            id: "sleep-positive",
            title: "Excellent rythme de sommeil !",
            description: "Vous maintenez une durée de sommeil optimale",
            category: "sleep",
            type: "positive",
            explanation: "Un sommeil de qualité est essentiel pour la récupération et la progression",
            dataPoints: [`Moyenne actuelle: ${Math.round(avgDuration/60)}h/nuit`, "Objectif atteint !"]
          });
        } else {
          recommendations.push({
            id: "sleep-improvement",
            title: "Optimisez votre sommeil",
            description: "Pour une meilleure récupération",
            category: "sleep",
            type: "improvement",
            explanation: "Votre durée moyenne de sommeil est inférieure aux recommandations",
            dataPoints: [`Moyenne actuelle: ${Math.round(avgDuration/60)}h/nuit`, "Objectif: 7-8h/nuit"]
          });
        }
      }

      // S'assurer qu'il y a au moins une recommandation par catégorie
      const categories = ["workout", "nutrition", "sleep"];
      categories.forEach(category => {
        if (!recommendations.some(r => r.category === category)) {
          recommendations.push({
            id: `${category}-default`,
            title: `Commencez à tracker votre ${category === 'workout' ? 'entraînement' : category === 'nutrition' ? 'alimentation' : 'sommeil'}`,
            description: "Pour obtenir des recommandations personnalisées",
            category: category as "workout" | "nutrition" | "sleep",
            type: "improvement",
            explanation: "Nous avons besoin de données pour vous fournir des recommandations pertinentes",
            dataPoints: ["Commencez dès aujourd'hui"]
          });
        }
      });

      return recommendations;
    },
    staleTime: 24 * 60 * 60 * 1000, // Rafraîchir les données chaque jour
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
              className={`p-4 rounded-lg transition-colors cursor-pointer ${
                rec.type === 'positive' 
                  ? 'bg-green-500/10 hover:bg-green-500/20' 
                  : 'bg-muted/50 hover:bg-muted/70'
              }`}
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
                        variant={rec.type === 'positive' ? 'default' : 'secondary'}
                        className={`capitalize ${
                          rec.category === 'workout' ? 'bg-blue-500' :
                          rec.category === 'nutrition' ? 'bg-green-500' : 
                          'bg-purple-500'
                        } text-white`}
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