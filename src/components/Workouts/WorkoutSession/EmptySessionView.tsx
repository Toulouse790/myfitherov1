
import { AlertCircle } from "lucide-react";
import { Header } from "@/components/Layout/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { SmartWorkoutGenerator } from "@/components/Workouts/SmartWorkoutGenerator";

export const EmptySessionView = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('main_objective, experience_level, available_equipment')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setUserInfo(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du profil:", error);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container max-w-2xl mx-auto p-4 pt-20">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground" />
            <h2 className="text-xl font-semibold">
              {t("workouts.sessionNotFound") || "Session non trouvée"}
            </h2>
            <p className="text-muted-foreground">
              {t("workouts.sessionEmptyDesc") || "Cette séance d'entraînement ne contient aucun exercice ou n'existe pas."}
            </p>
            
            {showGenerator ? (
              <div className="w-full">
                <h3 className="text-lg font-medium mb-4">
                  {t("workouts.createNewWorkout") || "Créer un nouvel entraînement"}
                </h3>
                <SmartWorkoutGenerator />
              </div>
            ) : (
              <div className="flex flex-col space-y-3 w-full">
                <Button onClick={() => setShowGenerator(true)}>
                  {t("workouts.createWorkout") || "Créer un entraînement"}
                </Button>
                <Button variant="outline" onClick={() => navigate('/workouts')}>
                  {t("workouts.backToWorkouts") || "Retour aux entraînements"}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
