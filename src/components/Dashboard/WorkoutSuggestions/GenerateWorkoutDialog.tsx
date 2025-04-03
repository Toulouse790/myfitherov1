
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useWorkoutOperations } from "@/hooks/workout/use-workout-operations";
import { useAuth } from "@/hooks/use-auth";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Dumbbell, X, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GenerateWorkoutDialogProps } from "./types";
import { translateMuscleGroup } from "@/utils/muscleGroupTranslations";

export const GenerateWorkoutDialog = ({ isOpen, onClose, workoutType = "custom", initialDuration = 45 }: GenerateWorkoutDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { startWorkout } = useWorkoutOperations();
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Récupérer les préférences d'entraînement de l'utilisateur
  const { data: userPreferences, isLoading: loadingPreferences } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        // Use maybeSingle instead of single to avoid error when no data is found
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
        // Return default preferences if no data found
        if (!data) {
          return {
            fitness_level: 'beginner',
            preferred_duration: initialDuration || 45,
            training_location: 'home',
            available_equipment: ['minimal'],
            focus_areas: ['full_body']
          };
        }
        
        return data;
      } catch (error) {
        console.error('Error fetching user preferences:', error);
        // Return default preferences on error
        return {
          fitness_level: 'beginner',
          preferred_duration: initialDuration || 45,
          training_location: 'home',
          available_equipment: ['minimal'],
          focus_areas: ['full_body']
        };
      }
    },
    enabled: !!user && isOpen
  });

  // Générer un entraînement avec l'API
  const generateWorkout = async () => {
    if (loadingPreferences) return;
    
    try {
      setIsGenerating(true);
      setGeneratedWorkout(null);
      
      // Adapter les préférences à la fonction de génération de workout
      const preferences = {
        userLevel: userPreferences?.fitness_level || 'beginner',
        workoutType: workoutType,
        duration: userPreferences?.preferred_duration || initialDuration || 45,
        location: userPreferences?.training_location || 'home',
        equipment: userPreferences?.available_equipment || 'minimal',
        muscleGroups: userPreferences?.focus_areas || ['full_body']
      };
      
      console.log("Génération d'un entraînement avec préférences:", preferences);
      
      try {
        // Appeler la fonction Supabase Edge pour générer l'entraînement
        const { data: workout, error } = await supabase.functions.invoke('generate-workout', {
          body: { userPreferences: preferences }
        });
        
        if (error) throw error;
        
        console.log("Entraînement généré avec succès:", workout);
        
        // S'assurer que la durée reflète celle demandée
        if (workout && typeof workout === 'object') {
          workout.duration = preferences.duration;
        }
        
        setGeneratedWorkout(workout);
      } catch (edgeError) {
        console.error('Error calling edge function:', edgeError);
        throw new Error("Impossible d'appeler la fonction de génération");
      }
      
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: t("workouts.generationErrorTitle"),
        description: t("workouts.generationErrorDescription"),
        variant: "destructive",
      });
      
      // Générer un entraînement de secours local en cas d'échec avec des exercices variés
      const fallbackExercises = getFallbackExercises(workoutType);
      setGeneratedWorkout({
        exercises: fallbackExercises,
        duration: initialDuration || 45,
        difficulty: 'moderate',
        description: t("workouts.fallbackWorkoutDescription") || "Voici un entraînement par défaut qui vous permettra de vous dépenser."
      });
      
    } finally {
      setIsGenerating(false);
    }
  };

  // Obtenir des exercices de secours basés sur le type d'entraînement avec plus de variété
  const getFallbackExercises = (type: string) => {
    // Exercices par défaut en cas d'échec de l'API avec plus de variété
    const exercisePool = {
      full_body: [
        { name: "Squats", sets: 3, reps: 12, rest: 60 },
        { name: "Pompes", sets: 3, reps: 10, rest: 60 },
        { name: "Rowing haltère", sets: 3, reps: 12, rest: 60 },
        { name: "Fentes", sets: 3, reps: 10, rest: 60 },
        { name: "Mountain Climbers", sets: 3, reps: 20, rest: 45 },
        { name: "Extensions de triceps", sets: 3, reps: 12, rest: 60 },
        { name: "Crunchs", sets: 3, reps: 15, rest: 45 },
        { name: "Superman", sets: 3, reps: 10, rest: 45 }
      ],
      upper_body: [
        { name: "Pompes", sets: 4, reps: 12, rest: 60 },
        { name: "Rowing haltère", sets: 3, reps: 12, rest: 60 },
        { name: "Développé épaules", sets: 3, reps: 12, rest: 60 },
        { name: "Extensions triceps", sets: 3, reps: 15, rest: 60 },
        { name: "Curl biceps", sets: 3, reps: 12, rest: 60 },
        { name: "Élévations latérales", sets: 3, reps: 15, rest: 45 }
      ],
      lower_body: [
        { name: "Squats", sets: 4, reps: 15, rest: 60 },
        { name: "Fentes", sets: 3, reps: 12, rest: 60 },
        { name: "Extensions jambes", sets: 3, reps: 15, rest: 60 },
        { name: "Montées sur banc", sets: 3, reps: 12, rest: 60 },
        { name: "Kickbacks", sets: 3, reps: 15, rest: 45 },
        { name: "Pont fessier", sets: 3, reps: 15, rest: 45 }
      ],
      quick: [
        { name: "Burpees", sets: 3, reps: 10, rest: 30 },
        { name: "Mountain climbers", sets: 3, reps: 20, rest: 30 },
        { name: "Jumping jacks", sets: 3, reps: 30, rest: 30 },
        { name: "Squats sautés", sets: 3, reps: 12, rest: 30 },
        { name: "Planche", sets: 3, reps: 30, rest: 30 }
      ]
    };
    
    // Sélectionner un ensemble d'exercices aléatoires basé sur le type
    const exercises = exercisePool[type as keyof typeof exercisePool] || exercisePool.full_body;
    
    // Déterminer le nombre d'exercices basé sur la durée
    const targetDuration = initialDuration || 45;
    const exerciseCount = Math.max(3, Math.min(8, Math.floor(targetDuration / 15) + 2));
    
    // Mélanger les exercices pour plus de variété
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    
    // Retourner le nombre approprié d'exercices
    return shuffled.slice(0, exerciseCount);
  };

  // Démarrer l'entraînement généré
  const startGeneratedWorkout = async () => {
    if (!generatedWorkout || !user) return;
    
    try {
      setIsStarting(true);
      
      // Créer une session d'entraînement avec les exercices générés
      const exerciseNames = generatedWorkout.exercises.map((ex: any) => ex.name);
      console.log("Démarrage de l'entraînement avec exercices:", exerciseNames);
      
      const session = await startWorkout(undefined, exerciseNames);
      
      if (!session) {
        throw new Error("Impossible de créer la session d'entraînement");
      }
      
      // Rediriger vers la page de session d'entraînement
      console.log("Session créée, redirection vers:", `workouts/${session.id}`);
      onClose();
      navigate(`/workouts/${session.id}`);
      
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: t("workouts.startSessionErrorTitle") || "Erreur",
        description: t("workouts.startSessionErrorDescription") || "Impossible de démarrer la session",
        variant: "destructive",
      });
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("workouts.generateWorkoutTitle")}</DialogTitle>
          <DialogDescription>
            {t("workouts.generateWorkoutDescription")}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {!generatedWorkout && !isGenerating && (
            <Button onClick={generateWorkout} className="w-full">
              <Dumbbell className="mr-2 h-4 w-4" />
              {t("workouts.generateSession")}
            </Button>
          )}
          
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p>{t("workouts.generatingWorkout")}</p>
            </div>
          )}
          
          {generatedWorkout && (
            <>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <h3 className="font-semibold">{t("workouts.workoutPreview")}</h3>
                  <div className="flex gap-2">
                    <Badge>
                      ~{generatedWorkout.duration} {t("workouts.minutes")}
                    </Badge>
                    <Badge variant="outline">
                      {t(`difficulty.${generatedWorkout.difficulty}`) || generatedWorkout.difficulty}
                    </Badge>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {generatedWorkout.description}
                </p>
              </div>
              
              <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                {generatedWorkout.exercises.map((exercise: any, index: number) => (
                  <Card key={index} className="p-3 border">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{exercise.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {exercise.sets} {t("workouts.sets")} × {exercise.reps} {t("workouts.reps")}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {exercise.rest}s {t("workouts.restLabel")}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <Button 
                  onClick={startGeneratedWorkout} 
                  className="flex-1"
                  disabled={isStarting}
                >
                  {isStarting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Dumbbell className="mr-2 h-4 w-4" />
                  )}
                  {t("workouts.startSession")}
                </Button>
                
                <Button 
                  onClick={generateWorkout}
                  variant="outline" 
                  className="flex-1"
                  disabled={isGenerating || isStarting}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {t("workouts.regenerate")}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
