
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Timer, Flame, ArrowLeft, Activity, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function StartWorkout() {
  const router = useRouter();
  const { id } = router.query;
  const { toast } = useToast();
  const { user } = useAuth();
  const [workout, setWorkout] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number | null>(null);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (id && user) {
      fetchWorkoutDetails();
    }
  }, [id, user]);

  useEffect(() => {
    // Nettoyage du timer au démontage du composant
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, [timerInterval]);

  const fetchWorkoutDetails = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('workout_recommendations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setWorkout(data);
    } catch (error) {
      console.error("Erreur lors du chargement du programme:", error);
      toast({
        title: "Erreur de chargement",
        description: "Impossible de charger les détails du programme",
        variant: "destructive",
      });
      router.push('/workouts');
    } finally {
      setIsLoading(false);
    }
  };

  const startWorkout = () => {
    setWorkoutStarted(true);
    setActiveExerciseIndex(0);
    
    // Démarrer le chronomètre de la séance
    const interval = setInterval(() => {
      setSessionTimer(prev => prev + 1);
    }, 1000);
    
    setTimerInterval(interval);
  };

  const completeExercise = (index: number) => {
    setCompletedExercises(prev => [...prev, index]);
    
    if (index + 1 < (workout?.exercises?.length || 0)) {
      setActiveExerciseIndex(index + 1);
    } else {
      finishWorkout();
    }
  };

  const finishWorkout = async () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    try {
      // Enregistrer la séance dans la base de données
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([{
          user_id: user?.id,
          program_id: id,
          total_duration_minutes: Math.floor(sessionTimer / 60),
          exercises: workout?.exercises?.map(e => e.name),
          calories_burned: workout?.calories_estimate || 0,
          completed: true,
          perceived_difficulty: 'moderate'
        }])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Entraînement terminé",
        description: `Séance de ${Math.floor(sessionTimer / 60)} minutes complétée!`,
      });
      
      router.push(`/workouts/summary/${data.id}`);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la séance:", error);
      
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer votre séance. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
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

  if (!workout) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-4xl mx-auto p-4 mt-6">
          <div className="text-center py-12">
            <Dumbbell className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold mb-2">Programme non trouvé</h2>
            <p className="text-muted-foreground mb-6">
              Ce programme d'entraînement n'existe pas ou n'est pas accessible.
            </p>
            <Button onClick={() => router.push('/workouts')}>
              Retour aux entraînements
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const activeExercise = activeExerciseIndex !== null ? workout.exercises[activeExerciseIndex] : null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push('/workouts')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold ml-2">
            {workout.name || "Programme d'entraînement"}
          </h1>
        </div>

        {/* Informations sur la séance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Détails du programme</CardTitle>
            <CardDescription>
              {workout.target_muscle_groups?.join(', ') || 'Programme complet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center">
                <Dumbbell className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm text-muted-foreground">Exercices</span>
                <span className="font-semibold">{workout.exercises?.length || 0}</span>
              </div>
              <div className="flex flex-col items-center">
                <Timer className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm text-muted-foreground">Durée estimée</span>
                <span className="font-semibold">{workout.duration || '30'} min</span>
              </div>
              <div className="flex flex-col items-center">
                <Flame className="h-8 w-8 mb-2 text-primary" />
                <span className="text-sm text-muted-foreground">Calories</span>
                <span className="font-semibold">~{workout.calories_estimate || 300}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {!workoutStarted ? (
              <Button 
                className="w-full"
                onClick={startWorkout}
              >
                Commencer l'entraînement
              </Button>
            ) : (
              <div className="w-full flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-primary animate-pulse" />
                  <span className="font-mono text-lg">{formatTime(sessionTimer)}</span>
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    onClick={finishWorkout}
                  >
                    Terminer la séance
                  </Button>
                </div>
              </div>
            )}
          </CardFooter>
        </Card>

        {/* Liste des exercices */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exercices</h2>
          
          {workout.exercises?.map((exercise, index) => (
            <Card 
              key={index}
              className={`transition-all ${
                activeExerciseIndex === index ? 'ring-2 ring-primary' : ''
              } ${
                completedExercises.includes(index) ? 'bg-muted/20' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center">
                    {completedExercises.includes(index) ? (
                      <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                    ) : (
                      <Dumbbell className="h-5 w-5 mr-2 text-primary" />
                    )}
                    {exercise.name}
                  </CardTitle>
                </div>
                <CardDescription className="flex items-center gap-3 text-xs">
                  <span>{exercise.sets} séries</span>
                  <span>•</span>
                  <span>{exercise.reps} répétitions</span>
                  <span>•</span>
                  <span>{exercise.rest}s repos</span>
                </CardDescription>
              </CardHeader>
              
              {activeExerciseIndex === index && workoutStarted && (
                <CardContent className="pb-2">
                  <div className="bg-muted p-3 rounded-md">
                    <h4 className="font-medium mb-1">Instructions</h4>
                    <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                      <li>Effectuez {exercise.sets} séries de {exercise.reps} répétitions</li>
                      <li>Reposez-vous {exercise.rest} secondes entre chaque série</li>
                      <li>Gardez une forme correcte pendant toute l'exécution</li>
                    </ul>
                  </div>
                </CardContent>
              )}
              
              {activeExerciseIndex === index && workoutStarted && (
                <CardFooter>
                  <Button 
                    className="w-full"
                    onClick={() => completeExercise(index)}
                  >
                    {completedExercises.includes(index) ? 'Déjà complété' : 'Marquer comme terminé'}
                  </Button>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
