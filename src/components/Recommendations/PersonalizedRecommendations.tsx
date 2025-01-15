import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "workout" | "nutrition" | "sleep";
}

export const PersonalizedRecommendations = () => {
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
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Target className="w-5 h-5 text-primary" />
          <CardTitle>Recommandation</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {rec.description}
                  </p>
                </div>
                <Badge>{rec.category}</Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};