
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Dumbbell, Calendar, Clock, Zap, Activity, ChevronRight } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { muscleRecoveryData } from "@/utils/workoutPlanning";

export function SmartWorkoutGenerator() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  const [duration, setDuration] = useState([30]);
  const [intensity, setIntensity] = useState([50]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<string[]>([]);
  const [isBalancedMode, setIsBalancedMode] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [previousWorkouts, setPreviousWorkouts] = useState<any[]>([]);
  const [suggestedExercises, setSuggestedExercises] = useState<string[]>([]);

  // Récupérer le profil de l'utilisateur et ses séances précédentes
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      // Récupérer le profil utilisateur
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      setUserProfile(profile);
      
      // Récupérer les séances précédentes
      const { data: workouts } = await supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (workouts) {
        setPreviousWorkouts(workouts);
        
        // Suggérer automatiquement des groupes musculaires basés sur l'historique
        suggestMuscleGroups(workouts);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
    }
  };

  // Suggérer intelligemment des groupes musculaires basés sur l'historique d'entraînement
  const suggestMuscleGroups = (workouts: any[]) => {
    if (!workouts.length) return;
    
    // Récupérer les groupes musculaires entraînés récemment
    const recentlyTrainedMuscles = new Set<string>();
    
    workouts.forEach(workout => {
      const exerciseNames = workout.exercises || [];
      exerciseNames.forEach(async (name: string) => {
        try {
          // Récupérer le groupe musculaire pour cet exercice
          const { data } = await supabase
            .from('unified_exercises')
            .select('muscle_group')
            .eq('name', name)
            .single();
          
          if (data?.muscle_group) {
            recentlyTrainedMuscles.add(data.muscle_group);
          }
        } catch (error) {
          console.error(`Erreur lors de la récupération du groupe musculaire pour ${name}:`, error);
        }
      });
    });
    
    // Trouver des groupes musculaires qui n'ont pas été entraînés récemment
    const allMuscleGroups = Object.keys(muscleRecoveryData);
    const suggestedGroups = allMuscleGroups.filter(group => !recentlyTrainedMuscles.has(group));
    
    // Si tous les groupes ont été entraînés, suggérer les plus anciens
    if (suggestedGroups.length === 0) {
      // Par défaut, suggérer les groupes majeurs comme objectif
      setSelectedMuscleGroups(['chest', 'back', 'legs']);
    } else {
      // Sélectionner les 2 premiers groupes suggérés
      setSelectedMuscleGroups(suggestedGroups.slice(0, 2));
    }
  };

  // Suggérer des exercices basés sur le niveau, l'équipement disponible et les objectifs
  const generateSuggestedExercises = async () => {
    try {
      const params: any = {
        muscleGroups: selectedMuscleGroups,
        duration: duration[0],
        intensity: intensity[0] / 100
      };
      
      if (userProfile) {
        params.experienceLevel = userProfile.experience_level || 'intermediate';
        params.availableEquipment = userProfile.available_equipment || ['gym'];
        params.goal = userProfile.objective || 'muscle_gain';
      }
      
      // Récupérer des exercices appropriés depuis la base de données
      const { data: exercises } = await supabase
        .from('unified_exercises')
        .select('name')
        .in('muscle_group', selectedMuscleGroups)
        .eq('est_publié', true)
        .limit(8);
      
      if (exercises && exercises.length > 0) {
        // Extraire les noms des exercices
        return exercises.map(ex => ex.name);
      }
      
      return [];
    } catch (error) {
      console.error("Erreur lors de la génération des exercices suggérés:", error);
      return [];
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    try {
      // Limiter le nombre d'exercices en fonction de la durée
      const maxExercises = duration[0] <= 30 ? 3 : (duration[0] <= 45 ? 4 : 6);
      
      // Obtenir des exercices suggérés
      const exercises = await generateSuggestedExercises();
      // Limiter le nombre d'exercices pour respecter la durée
      const limitedExercises = exercises.slice(0, maxExercises);
      setSuggestedExercises(limitedExercises);
      
      // Simuler un délai pour l'expérience utilisateur
      setTimeout(() => {
        setIsGenerating(false);
        
        if (limitedExercises.length > 0) {
          toast({
            title: "Séance générée",
            description: `${limitedExercises.length} exercices ont été sélectionnés pour vous`,
          });
        } else {
          toast({
            title: "Erreur de génération",
            description: "Impossible de générer des exercices. Veuillez réessayer.",
            variant: "destructive",
          });
        }
      }, 1500);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la génération de l'entraînement.",
        variant: "destructive",
      });
    }
  };

  const startWorkout = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour commencer un entraînement",
        variant: "destructive",
      });
      navigate('/signin');
      return;
    }
    
    if (suggestedExercises.length === 0) {
      toast({
        title: "Génération requise",
        description: "Veuillez d'abord générer une séance d'entraînement",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Créer une nouvelle session d'entraînement avec les exercices suggérés
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          exercises: suggestedExercises,
          target_duration_minutes: duration[0],
          intensity_level: intensity[0],
          workout_type: 'strength',
          status: 'in_progress'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Rediriger vers la page de la séance
        navigate(`/workouts/${data.id}`);
      }
    } catch (error) {
      console.error("Erreur lors de la création de la séance:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la séance d'entraînement",
        variant: "destructive",
      });
    }
  };

  // Fonction pour sélectionner/désélectionner un groupe musculaire
  const toggleMuscleGroup = (muscleGroup: string) => {
    setSelectedMuscleGroups(prev => 
      prev.includes(muscleGroup)
        ? prev.filter(group => group !== muscleGroup)
        : [...prev, muscleGroup]
    );
  };

  const estimatedCalories = Math.round((duration[0] * intensity[0] * 0.1) + 150);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>{t("workouts.generator") || "Générateur d'entraînement intelligent"}</CardTitle>
          <CardDescription>
            {t("workouts.generatorDescription") || "Créez un entraînement personnalisé et scientifiquement optimisé"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection des groupes musculaires */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Groupes musculaires ciblés</Label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(muscleRecoveryData).map(([key, value]) => (
                <Button
                  key={key}
                  variant={selectedMuscleGroups.includes(key) ? "default" : "outline"}
                  onClick={() => toggleMuscleGroup(key)}
                  className="text-xs py-1 h-auto"
                >
                  {value.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="balanced-mode" 
              checked={isBalancedMode}
              onCheckedChange={setIsBalancedMode}
            />
            <Label htmlFor="balanced-mode" className="text-sm">
              Mode équilibré (séance optimisée automatiquement)
            </Label>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                {t("workouts.duration") || "Durée"}: {duration[0]} min
              </label>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <Slider
              defaultValue={duration}
              onValueChange={setDuration}
              min={15}
              max={90}
              step={5}
              className="w-full"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">
                {t("workouts.intensity") || "Intensité"}: {intensity[0]}%
              </label>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </div>
            <Slider
              defaultValue={intensity}
              onValueChange={setIntensity}
              min={10}
              max={100}
              step={10}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 my-4">
            <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
              <Calendar className="h-5 w-5 mb-2 text-primary" />
              <span className="text-sm font-medium">{t("workouts.todayDate") || new Date().toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg">
              <Activity className="h-5 w-5 mb-2 text-primary" />
              <span className="text-sm font-medium">~{estimatedCalories} kcal</span>
            </div>
          </div>

          {suggestedExercises.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Exercices suggérés:</h3>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto bg-muted/10 p-2 rounded-md">
                {suggestedExercises.map((exercise, index) => (
                  <div key={index} className="flex items-center p-2 bg-background rounded-md">
                    <Dumbbell className="h-4 w-4 mr-2 text-primary" />
                    <span className="text-sm">{exercise}</span>
                  </div>
                ))}
              </div>
              
              <Button 
                onClick={startWorkout}
                className="w-full"
                size={isMobile ? "lg" : "default"}
              >
                <Dumbbell className="h-4 w-4 mr-2" />
                <span className="truncate">{t("workouts.startWorkout") || "Commencer l'entraînement"}</span>
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || selectedMuscleGroups.length === 0}
              className="w-full"
              size={isMobile ? "lg" : "default"}
            >
              {isGenerating ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent animate-spin mr-2" />
                  <span className="truncate">{t("workouts.generating") || "Génération en cours..."}</span>
                </>
              ) : (
                <>
                  <Dumbbell className="h-4 w-4 mr-2" />
                  <span className="truncate">{t("workouts.generateWorkout") || "Générer un entraînement"}</span>
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
