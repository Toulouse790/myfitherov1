
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, Calendar, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface SessionHeaderProps {
  sessionName?: string;
  sessionDuration: number;
  formatDuration: (seconds: number) => string;
  totalProgress: number;
  onFinishWorkout: () => void;
  sessionId?: string;
}

export const SessionHeader = ({
  sessionName = "Séance d'entraînement",
  sessionDuration,
  formatDuration,
  totalProgress,
  onFinishWorkout,
  sessionId,
}: SessionHeaderProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const [estimatedCalories, setEstimatedCalories] = useState<number>(0);
  const [isLoadingCalories, setIsLoadingCalories] = useState(true);

  useEffect(() => {
    const estimateCaloriesBurned = async () => {
      if (!user || sessionDuration <= 0) {
        setIsLoadingCalories(false);
        return;
      }
      
      try {
        setIsLoadingCalories(true);
        
        // Récupérer les données utilisateur nécessaires au calcul
        const { data: profileData } = await supabase
          .from('profiles')
          .select('weight_kg, gender, experience_level')
          .eq('id', user.id)
          .single();
          
        if (!profileData) {
          // Valeurs par défaut si pas de profil
          calculateWithDefaults();
          return;
        }
          
        const weight = profileData.weight_kg || 70;
        const gender = profileData.gender || 'male';
        const intensity = getIntensityFromExperience(profileData.experience_level);
        
        try {
          // Essaie d'utiliser la fonction RPC pour le calcul
          const { data: caloriesData, error } = await supabase.rpc('calculate_exercise_calories', {
            weight_kg: weight,
            duration_minutes: Math.round(sessionDuration / 60),
            intensity: intensity,
            gender: gender
          });
          
          if (caloriesData && !error) {
            setEstimatedCalories(caloriesData);
          } else {
            // Calcul approximatif si la fonction RPC échoue
            calculateBasic(weight, gender, intensity);
          }
        } catch (error) {
          // Calcul de secours
          calculateBasic(weight, gender, intensity);
        }
      } catch (error) {
        console.error("Erreur lors du calcul des calories:", error);
        // Calcul de base en cas d'erreur
        calculateWithDefaults();
      } finally {
        setIsLoadingCalories(false);
      }
    };
    
    const calculateBasic = (weight: number, gender: string, intensity: string) => {
      // Facteurs basés sur l'intensité
      const intensityFactor = 
        intensity === 'high' ? 8 : 
        intensity === 'low' ? 5 : 6;
      
      // Facteur de genre (ajustement métabolique)
      const genderFactor = gender === 'female' ? 0.9 : 1.0;
      
      // Calcul simplifié: minutes × facteur d'intensité × poids relatif × genre
      const calories = Math.round(
        (sessionDuration / 60) * 
        intensityFactor * 
        (weight / 70) * 
        genderFactor
      );
      
      setEstimatedCalories(calories);
    };
    
    const calculateWithDefaults = () => {
      // Calcul simplifié avec valeurs par défaut
      setEstimatedCalories(Math.round((sessionDuration / 60) * 7));
    };
    
    const getIntensityFromExperience = (experience: string | null): string => {
      switch (experience) {
        case 'beginner': return 'low';
        case 'advanced': return 'high';
        default: return 'medium';
      }
    };
    
    if (sessionDuration > 0) {
      estimateCaloriesBurned();
    } else {
      setIsLoadingCalories(false);
    }
  }, [user, sessionDuration]);

  return (
    <div className="bg-card rounded-lg p-4 mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">{sessionName}</h1>
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            <span>{formatDuration(sessionDuration)}</span>
          </div>
        </div>
        
        <Button variant="outline" size="sm" onClick={() => navigate('/workouts')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("common.back") || "Retour"}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 my-2">
        <div className="flex flex-col items-center justify-center p-3 bg-muted/20 rounded-lg">
          <Calendar className="h-5 w-5 mb-1 text-primary" />
          <span className="text-sm font-medium">
            {new Date().toLocaleDateString('fr-FR')}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-muted/20 rounded-lg">
          <Activity className="h-5 w-5 mb-1 text-primary" />
          {isLoadingCalories ? (
            <Skeleton className="h-4 w-16 mt-1" />
          ) : (
            <span className="text-sm font-medium">
              ~{estimatedCalories} kcal
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span>{t("workouts.progress") || "Progression"}</span>
          <span>{totalProgress}%</span>
        </div>
        <Progress value={totalProgress} className="h-2" />
      </div>
    </div>
  );
};
