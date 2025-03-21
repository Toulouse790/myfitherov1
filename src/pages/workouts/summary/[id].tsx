
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Timer, BarChart, Dumbbell, Share2, Calendar, ArrowLeft, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function WorkoutSummary() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const { user } = useAuth();
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [streakCount, setStreakCount] = useState(0);

  useEffect(() => {
    if (id && user) {
      fetchSessionDetails();
      fetchUserStreak();
    }
  }, [id, user]);

  const fetchSessionDetails = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          program:program_id(name, target_muscle_groups)
        `)
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setSession(data);
    } catch (error) {
      console.error("Erreur lors du chargement de la séance:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les détails de la séance",
        variant: "destructive",
      });
      navigate('/workouts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStreak = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_streaks')
        .select('current_streak')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setStreakCount(data.current_streak);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du streak:", error);
    }
  };

  const shareWorkout = () => {
    if (navigator.share) {
      navigator.share({
        title: 'J\'ai terminé mon entraînement!',
        text: `Je viens de compléter ${session?.exercises?.length || 0} exercices et brûlé environ ${session?.calories_burned || 0} calories!`,
        url: window.location.href,
      })
      .catch(error => {
        console.error('Erreur lors du partage:', error);
      });
    } else {
      toast({
        title: "Partage non disponible",
        description: "La fonctionnalité de partage n'est pas prise en charge par votre navigateur",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4 mt-6">
          <div className="h-6 w-1/3 bg-muted rounded animate-pulse mb-4"></div>
          <div className="h-32 bg-muted rounded animate-pulse mb-4"></div>
          <div className="h-64 bg-muted rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4 mt-6">
          <div className="text-center py-12">
            <BarChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Séance non trouvée</h2>
            <p className="text-muted-foreground mb-6">
              Cette séance d'entraînement n'existe pas ou n'est pas accessible.
            </p>
            <Button onClick={() => navigate('/workouts')}>
              Retour aux entraînements
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/workouts')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">
            Résultats de la séance
          </h1>
        </div>

        {/* Carte de félicitations */}
        <Card className="mb-6 bg-primary/10">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Bravo!</h2>
            <p className="text-muted-foreground">
              Vous avez terminé votre séance d'entraînement
            </p>
            
            {streakCount > 0 && (
              <div className="mt-4">
                <p className="text-sm font-medium">Série actuelle</p>
                <div className="flex items-center justify-center mt-1">
                  <Calendar className="h-4 w-4 mr-2 text-primary" />
                  <span className="text-xl font-bold">{streakCount} jours</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistiques de la séance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Statistiques de la séance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Durée</span>
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-semibold">{session.total_duration_minutes} minutes</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Calories</span>
                <div className="flex items-center">
                  <BarChart className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-semibold">{session.calories_burned} kcal</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Exercices</span>
                <div className="flex items-center">
                  <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-semibold">{session.exercises?.length || 0} exercices</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground">Progression</span>
                <div className="flex items-center">
                  <Trophy className="h-4 w-4 mr-2 text-primary" />
                  <span className="font-semibold">+{Math.round(session.calories_burned / 10)} points</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exercices réalisés */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Exercices complétés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {session.exercises?.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs mr-3">
                      {index + 1}
                    </span>
                    <span>{exercise}</span>
                  </div>
                  <Progress value={100} className="w-20 h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Boutons d'action */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" onClick={shareWorkout}>
            <Share2 className="h-4 w-4 mr-2" />
            Partager
          </Button>
          <Button onClick={() => navigate('/')}>
            <Home className="h-4 w-4 mr-2" />
            Accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
