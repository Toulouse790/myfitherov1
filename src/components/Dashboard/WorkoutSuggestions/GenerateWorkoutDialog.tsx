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
import { Loader2, Dumbbell, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { GenerateWorkoutDialogProps } from "./types";
import { useExerciseTranslation } from "@/hooks/use-exercise-translation";

interface GenerateWorkoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialDuration?: number;
  initialIntensity?: number; 
  workoutType?: string;
}

export const GenerateWorkoutDialog = ({ 
  isOpen, 
  onClose, 
  initialDuration = 45, 
  initialIntensity = 50,
  workoutType = ""
}: GenerateWorkoutDialogProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { startWorkout } = useWorkoutOperations();
  const { translateMuscleGroupWithContext } = useExerciseTranslation();
  const [generatedWorkout, setGeneratedWorkout] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [duration, setDuration] = useState(initialDuration);
  const [intensity, setIntensity] = useState(initialIntensity);
  const [selectedType, setSelectedType] = useState(workoutType || "");

  const { data: userPreferences, isLoading: loadingPreferences } = useQuery({
    queryKey: ['user-preferences', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
          
        if (error) throw error;
        
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

  const generateWorkout = async () => {
    if (loadingPreferences) return;
    
    try {
      setIsGenerating(true);
      setGeneratedWorkout(null);
      
      const preferences = {
        userLevel: userPreferences?.fitness_level || 'beginner',
        workoutType: selectedType,
        duration: duration || userPreferences?.preferred_duration || 45,
        location: userPreferences?.training_location || 'home',
        equipment: userPreferences?.available_equipment || 'minimal',
        muscleGroups: userPreferences?.focus_areas || ['full_body']
      };
      
      console.log("Génération d'un entraînement avec préférences:", preferences);
      
      try {
        const { data: workout, error } = await supabase.functions.invoke('generate-workout', {
          body: { userPreferences: preferences }
        });
        
        if (error) throw error;
        
        console.log("Entraînement généré avec succès:", workout);
        
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
      
      const fallbackExercises = getFallbackExercises(selectedType, duration);
      setGeneratedWorkout({
        exercises: fallbackExercises,
        duration: duration,
        difficulty: 'moderate',
        description: t("workouts.fallbackWorkoutDescription") || "Voici un entraînement par défaut qui vous permettra de vous dépenser."
      });
      
    } finally {
      setIsGenerating(false);
    }
  };

  const getFallbackExercises = (type: string, duration: number) => {
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
      ],
      custom: [
        { name: "Pompes", sets: 3, reps: 12, rest: 60 },
        { name: "Squats", sets: 3, reps: 15, rest: 60 },
        { name: "Fentes", sets: 3, reps: 12, rest: 60 },
        { name: "Mountain Climbers", sets: 3, reps: 20, rest: 45 },
        { name: "Gainage", sets: 3, reps: 30, rest: 45 },
        { name: "Crunchs", sets: 3, reps: 15, rest: 45 },
        { name: "Dips", sets: 3, reps: 10, rest: 60 },
        { name: "Burpees", sets: 3, reps: 10, rest: 45 }
      ],
      cardio: [
        { name: "Course à pied", sets: 1, reps: duration * 60, rest: 0 },
        { name: "Vélo", sets: 1, reps: duration * 60, rest: 0 },
        { name: "Rameur", sets: 1, reps: duration * 60, rest: 0 },
        { name: "Corde à sauter", sets: 3, reps: 60, rest: 30 }
      ],
      hiit: [
        { name: "Burpees", sets: 4, reps: 12, rest: 30 },
        { name: "Mountain climbers", sets: 4, reps: 30, rest: 30 },
        { name: "Jumping jacks", sets: 4, reps: 40, rest: 30 },
        { name: "Squats sautés", sets: 4, reps: 15, rest: 30 },
        { name: "High knees", sets: 4, reps: 40, rest: 30 }
      ],
      strength: [
        { name: "Développé couché", sets: 4, reps: 8, rest: 90 },
        { name: "Squats", sets: 4, reps: 10, rest: 90 },
        { name: "Soulevé de terre", sets: 4, reps: 8, rest: 120 },
        { name: "Tractions", sets: 3, reps: 8, rest: 90 },
        { name: "Développé militaire", sets: 3, reps: 10, rest: 90 }
      ],
      weight_loss: [
        { name: "Burpees", sets: 3, reps: 15, rest: 45 },
        { name: "Cardio (course)", sets: 1, reps: 600, rest: 0 },
        { name: "Circuit training", sets: 3, reps: 1, rest: 60 },
        { name: "Jumping jacks", sets: 3, reps: 40, rest: 30 },
        { name: "Mountain climbers", sets: 3, reps: 30, rest: 30 }
      ],
      muscle_gain: [
        { name: "Développé couché", sets: 4, reps: 8, rest: 90 },
        { name: "Rowing barre", sets: 4, reps: 8, rest: 90 },
        { name: "Curl biceps", sets: 3, reps: 12, rest: 60 },
        { name: "Extensions triceps", sets: 3, reps: 12, rest: 60 },
        { name: "Développé militaire", sets: 3, reps: 10, rest: 90 }
      ],
      recovery: [
        { name: "Étirements", sets: 1, reps: 300, rest: 0 },
        { name: "Marche", sets: 1, reps: 600, rest: 0 },
        { name: "Yoga", sets: 1, reps: 900, rest: 0 },
        { name: "Mobilité articulaire", sets: 1, reps: 300, rest: 0 }
      ],
      power: [
        { name: "Squats sautés", sets: 4, reps: 8, rest: 90 },
        { name: "Fentes sautées", sets: 4, reps: 8, rest: 90 },
        { name: "Box jumps", sets: 4, reps: 6, rest: 90 },
        { name: "Kettlebell swings", sets: 4, reps: 12, rest: 60 },
        { name: "Medicine ball slams", sets: 3, reps: 10, rest: 60 }
      ]
    };
    
    const exercises = exercisePool[type as keyof typeof exercisePool] || exercisePool.custom;
    
    const targetDuration = duration;
    const exerciseCount = Math.max(3, Math.min(8, Math.floor(targetDuration / 15) + 2));
    
    const shuffled = [...exercises].sort(() => 0.5 - Math.random());
    
    return shuffled.slice(0, exerciseCount);
  };

  const startGeneratedWorkout = async () => {
    if (!generatedWorkout || !user) return;
    
    try {
      setIsStarting(true);
      
      const exerciseNames = generatedWorkout.exercises.map((ex: any) => ex.name);
      console.log("Démarrage de l'entraînement avec exercices:", exerciseNames);
      
      const session = await startWorkout(undefined, exerciseNames);
      
      if (!session) {
        throw new Error("Impossible de créer la session d'entraînement");
      }
      
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
                      ~{generatedWorkout.duration} {t("common.minutes")}
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
                          {exercise.sets} {t("workouts.sets")} × {exercise.reps} {exercise.reps === 1 ? "" : t("workouts.reps")}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {exercise.rest}s {t("workouts.rest")}
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
