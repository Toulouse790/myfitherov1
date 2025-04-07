
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dumbbell, Footprints, LineChart, PlusCircle, Trophy } from "lucide-react";
import { RecommendedPrograms } from "@/components/Workouts/RecommendedPrograms";
import { useLanguage } from "@/contexts/LanguageContext";
import { SportPrograms } from "@/components/Workouts/SportPrograms";

export function HomeTab() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Démarrer une séance</CardTitle>
            <CardDescription>
              Créer une nouvelle séance personnalisée
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Dumbbell className="h-16 w-16 text-primary/60" />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => navigate('/workouts/generate')}
              className="w-full"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Nouvelle séance
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sport spécifique</CardTitle>
            <CardDescription>
              Programmes adaptés à votre discipline sportive
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Footprints className="h-16 w-16 text-primary/60" />
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => document.getElementById('sport-programs-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full"
            >
              <Footprints className="h-4 w-4 mr-2" />
              Programmes sportifs
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Performances récentes</CardTitle>
            <CardDescription>
              Suivez votre évolution et vos progrès
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-4">
            <Trophy className="h-16 w-16 text-primary/60" />
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              onClick={() => navigate('/workouts/progress')}
              className="w-full"
            >
              <LineChart className="h-4 w-4 mr-2" />
              Voir mes progrès
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <RecommendedPrograms />
      
      <div id="sport-programs-section">
        <SportPrograms />
      </div>
    </div>
  );
}
