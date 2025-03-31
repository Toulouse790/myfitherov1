
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Utensils, Moon } from "lucide-react";
import { SportTrainingRecommendation } from "@/types/workout-session";

interface SportRecommendationOverviewProps {
  recommendations: SportTrainingRecommendation | null;
  sportName?: string;
  positionName?: string;
}

export function SportRecommendationOverview({ 
  recommendations, 
  sportName, 
  positionName 
}: SportRecommendationOverviewProps) {
  if (!recommendations) {
    return null;
  }

  return (
    <Card className="w-full mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span>
            {sportName && positionName 
              ? `Recommandations pour ${positionName} (${sportName})` 
              : "Recommandations personnalisées"}
          </span>
        </CardTitle>
        <CardDescription>
          Basées sur les recherches scientifiques les plus récentes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="training">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="training" className="flex-1">Entraînement</TabsTrigger>
            <TabsTrigger value="nutrition" className="flex-1">Nutrition</TabsTrigger>
            <TabsTrigger value="sleep" className="flex-1">Récupération</TabsTrigger>
          </TabsList>
          
          <TabsContent value="training" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Exercices principaux</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.primaryExercises.map((exercise, index) => (
                  <Badge key={index} variant="outline" className="bg-primary/10">
                    {exercise}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Exercices secondaires</h4>
              <div className="flex flex-wrap gap-2">
                {recommendations.secondaryExercises.map((exercise, index) => (
                  <Badge key={index} variant="outline" className="bg-secondary/10">
                    {exercise}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">Métriques de performance</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(recommendations.performanceMetrics).map(([metric, value]) => (
                  <div key={metric} className="bg-muted p-2 rounded-md">
                    <div className="text-sm capitalize">{metric.replace(/_/g, ' ')}</div>
                    <div className="w-full bg-gray-300 h-2 rounded-full mt-1">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(value/10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="nutrition">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Recommandations nutritionnelles</h4>
              </div>
              
              <div className="grid gap-2">
                <div className="bg-muted p-3 rounded-md">
                  <div className="font-medium">Protéines</div>
                  <div className="text-sm text-muted-foreground">
                    {recommendations.nutritionGuidelines.proteinIntake} g/kg de poids corporel
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="font-medium">Glucides</div>
                  <div className="text-sm text-muted-foreground">
                    {recommendations.nutritionGuidelines.carbohydrateIntake} g/kg de poids corporel
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="font-medium">Hydratation</div>
                  <div className="text-sm text-muted-foreground">
                    {recommendations.nutritionGuidelines.hydrationNeeds}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                * Ces recommandations doivent être adaptées à votre morphologie et à vos besoins spécifiques
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sleep">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Moon className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">Sommeil et récupération</h4>
              </div>
              
              <div className="grid gap-2">
                <div className="bg-muted p-3 rounded-md">
                  <div className="font-medium">Durée de sommeil recommandée</div>
                  <div className="text-sm text-muted-foreground">
                    {recommendations.sleepRecommendations.minHours} heures minimum
                  </div>
                </div>
                
                <div className="bg-muted p-3 rounded-md">
                  <div className="font-medium">Focus de récupération</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {recommendations.sleepRecommendations.recoveryFocus.map((focus, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground mt-2">
                * La qualité du sommeil est aussi importante que sa durée pour les performances sportives
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
