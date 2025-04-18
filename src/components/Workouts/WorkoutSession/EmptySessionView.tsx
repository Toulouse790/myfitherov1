
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
import { Skeleton } from "@/components/ui/skeleton";

interface UserWorkoutProfile {
  main_objective: string | null;
  experience_level: string | null;
  available_equipment: string[] | null;
  training_frequency: string | null;
}

export const EmptySessionView = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserWorkoutProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showGenerator, setShowGenerator] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Récupération des données du profil principal
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('main_objective, experience_level, available_equipment, training_frequency')
          .eq('id', user.id)
          .single();
          
        if (profileError && profileError.code !== 'PGRST116') {
          console.error("Erreur lors de la récupération du profil:", profileError);
          throw profileError;
        }

        // Si pas de données de profil, cherchons dans les réponses au questionnaire
        if (!profileData || !profileData.experience_level) {
          const { data: questionnaireData, error: questionnaireError } = await supabase
            .from('questionnaire_responses')
            .select('objective, experience_level, available_equipment, training_frequency')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
            
          if (questionnaireData && !questionnaireError) {
            // Transformer les données du questionnaire au format attendu
            setUserProfile({
              main_objective: questionnaireData.objective,
              experience_level: questionnaireData.experience_level,
              available_equipment: questionnaireData.available_equipment,
              training_frequency: questionnaireData.training_frequency
            });
          } else {
            // Si aucune donnée n'est trouvée, utiliser des valeurs par défaut
            setUserProfile({
              main_objective: "maintenance",
              experience_level: "beginner",
              available_equipment: ["none"],
              training_frequency: "3"
            });
          }
        } else {
          // Utiliser les données du profil
          setUserProfile(profileData);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur:", error);
        // Définir des valeurs par défaut en cas d'erreur
        setUserProfile({
          main_objective: "maintenance",
          experience_level: "beginner",
          available_equipment: ["none"],
          training_frequency: "3"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container max-w-2xl mx-auto p-4 pt-20">
          <Card className="p-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
              <div className="w-full space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }
  
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
                <SmartWorkoutGenerator 
                  initialValues={{
                    objective: userProfile?.main_objective || "maintenance",
                    experience: userProfile?.experience_level || "beginner",
                    equipment: userProfile?.available_equipment || ["none"]
                  }}
                />
              </div>
            ) : (
              <div className="flex flex-col space-y-3 w-full">
                <Button onClick={() => setShowGenerator(true)} className="w-full">
                  {t("workouts.createWorkout") || "Créer un entraînement"}
                </Button>
                <Button variant="outline" onClick={() => navigate('/workouts')} className="w-full">
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
