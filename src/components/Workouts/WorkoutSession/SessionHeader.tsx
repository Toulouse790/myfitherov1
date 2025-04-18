
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, Calendar, Activity, BarChart, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [userInfo, setUserInfo] = useState<any>(null);
  const [estimatedCalories, setEstimatedCalories] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        // Récupérer le profil utilisateur
        const { data: profileData } = await supabase
          .from('profiles')
          .select('weight_kg, gender, experience_level')
          .eq('id', user.id)
          .single();
          
        if (profileData) {
          setUserInfo(profileData);
          
          // Calculer les calories estimées
          const weight = profileData.weight_kg || 70;
          const gender = profileData.gender || 'male';
          const intensity = profileData.experience_level === 'beginner' ? 'low' : 
                           (profileData.experience_level === 'advanced' ? 'high' : 'medium');
          
          try {
            // Tentative d'utilisation de la fonction RPC pour le calcul précis
            const { data: caloriesData } = await supabase.rpc('calculate_exercise_calories', {
              weight_kg: weight,
              duration_minutes: Math.round(sessionDuration / 60),
              intensity: intensity,
              gender: gender
            });
            
            if (caloriesData) {
              setEstimatedCalories(caloriesData);
            } else {
              // Calcul approximatif si la fonction RPC échoue
              const baseCals = Math.round(sessionDuration / 60) * 7 * (weight/70);
              const genderFactor = gender === 'female' ? 0.9 : 1.0;
              setEstimatedCalories(Math.round(baseCals * genderFactor));
            }
          } catch (error) {
            // Calcul de secours
            setEstimatedCalories(Math.round((sessionDuration / 60) * 8));
          }
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
      }
    };
    
    if (sessionDuration > 0) {
      fetchUserData();
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
          <span className="text-sm font-medium">
            ~{estimatedCalories} kcal
          </span>
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
