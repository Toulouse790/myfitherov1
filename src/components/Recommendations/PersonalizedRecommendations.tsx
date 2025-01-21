import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "workout" | "nutrition" | "sleep";
}

export const PersonalizedRecommendations = () => {
  const { user } = useAuth();
  
  const recommendations: Recommendation[] = [
    {
      id: "1",
      title: "Augmentez votre activité cardio",
      description: "Basé sur vos objectifs de perte de poids",
      category: "workout"
    },
    {
      id: "2",
      title: "Ajoutez plus de protéines",
      description: "Pour atteindre vos objectifs de masse musculaire",
      category: "nutrition"
    },
    {
      id: "3",
      title: "Optimisez votre sommeil",
      description: "Pour une meilleure récupération",
      category: "sleep"
    }
  ];

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle>Recommandations personnalisées</CardTitle>
          </div>
          <Info className="w-4 h-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">
          Ces suggestions sont basées sur votre profil, vos objectifs et votre activité récente
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
                </div>
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
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};