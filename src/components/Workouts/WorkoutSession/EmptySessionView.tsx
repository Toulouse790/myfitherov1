
import React, { useEffect, useState } from 'react';
import { AlertCircle, Dumbbell, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { calculateConfidenceScore } from "@/utils/ai-utils";

export const EmptySessionView = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [personalizedRecommendation, setPersonalizedRecommendation] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(0);

  useEffect(() => {
    // Récupérer les données historiques pour générer une recommandation personnalisée
    const fetchUserData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // 1. Récupérer le profil utilisateur
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        // 2. Récupérer les dernières séances d'entraînement
        const { data: recentWorkouts } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(5);
          
        // 3. Récupérer les groupes musculaires récemment travaillés
        const muscleGroups = new Set();
        const exerciseNames = recentWorkouts?.flatMap(workout => workout.exercises || []) || [];
        
        if (exerciseNames.length > 0) {
          const { data: exercises } = await supabase
            .from('unified_exercises')
            .select('name, muscle_group')
            .in('name', exerciseNames);
            
          exercises?.forEach(ex => {
            if (ex.muscle_group) muscleGroups.add(ex.muscle_group);
          });
        }
        
        // 4. Déterminer les groupes musculaires à travailler (ceux qui n'ont pas été travaillés récemment)
        const allMuscleGroups = ['chest', 'back', 'legs', 'shoulders', 'biceps', 'triceps', 'abs'];
        const recentlyWorkedMuscles = Array.from(muscleGroups);
        const suggestedMuscles = allMuscleGroups
          .filter(muscle => !recentlyWorkedMuscles.includes(muscle))
          .slice(0, 2); // Suggérer 2 groupes musculaires
          
        // Si tous les groupes ont été travaillés récemment, suggérer les groupes principaux
        if (suggestedMuscles.length === 0) {
          suggestedMuscles.push('legs', 'back'); // Groupes majeurs toujours bénéfiques
        }
        
        // 5. Générer une recommandation adaptée au niveau et objectifs
        const historicalData = {
          recentWorkouts: recentWorkouts?.length || 0,
          nutrition: profile?.diet_type || 'balanced',
          experienceLevel: profile?.experience_level || 'intermediate',
          objective: profile?.main_objective || 'muscle_gain'
        };
        
        // Calculer un score de confiance
        const score = calculateConfidenceScore(historicalData);
        setConfidenceScore(score);
        
        // Créer la recommandation
        setPersonalizedRecommendation({
          muscleGroups: suggestedMuscles,
          intensity: historicalData.recentWorkouts > 10 ? 'high' : 'moderate',
          duration: profile?.workout_duration || 45,
          suggestion: t(`workouts.suggestion_${suggestedMuscles[0]}`) || `Entraînement ${suggestedMuscles[0]}`
        });
        
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, t]);

  // Générer et démarrer une séance personnalisée
  const startPersonalizedSession = async () => {
    if (!user || !personalizedRecommendation) return;
    
    try {
      setLoading(true);
      
      // Récupérer des exercices pour les groupes musculaires suggérés
      const { data: exercises } = await supabase
        .from('unified_exercises')
        .select('name')
        .in('muscle_group', personalizedRecommendation.muscleGroups)
        .eq('est_publié', true)
        .limit(6);
      
      if (!exercises || exercises.length < 2) {
        navigate('/workouts/create');
        return;
      }
      
      // Créer une nouvelle session d'entraînement
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          exercises: exercises.map(ex => ex.name),
          status: 'in_progress',
          workout_type: 'strength',
          total_duration_minutes: personalizedRecommendation.duration,
          is_adapted: true
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Rediriger vers la nouvelle session
      navigate(`/workouts/session/${data.id}`);
      
    } catch (error) {
      console.error("Erreur lors de la création de la séance:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">
          {t("workouts.sessionNotFound")}
        </h2>
        <p className="text-muted-foreground">
          {t("workouts.sessionEmptyDesc")}
        </p>
        
        {personalizedRecommendation && (
          <div className="mt-6 w-full border border-muted p-4 rounded-lg bg-muted/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">{t("workouts.personalizedRecommendation")}</h3>
              </div>
              <div className="px-2 py-1 bg-green-500/10 text-green-600 text-xs rounded-full">
                {confidenceScore}% {t("workouts.confident")}
              </div>
            </div>
            
            <p className="text-sm text-left mb-4">
              {personalizedRecommendation.suggestion}
            </p>
            
            <div className="flex justify-between text-xs text-muted-foreground mb-4">
              <span>{personalizedRecommendation.duration} min</span>
              <span>{t(`workouts.intensity.${personalizedRecommendation.intensity}`)}</span>
              <span>{personalizedRecommendation.muscleGroups.join(', ')}</span>
            </div>
            
            <Button 
              onClick={startPersonalizedSession}
              className="w-full gap-2"
              disabled={loading}
            >
              <Dumbbell className="h-4 w-4" />
              {loading ? t("common.loading") : t("workouts.startAdaptedSession")}
            </Button>
          </div>
        )}
        
        <div className="flex flex-col space-y-3 w-full mt-4">
          <Button 
            onClick={() => navigate('/workouts/create')} 
            className="w-full"
            variant="default"
          >
            {t("workouts.createWorkout")}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/workouts')} 
            className="w-full"
          >
            {t("workouts.backToWorkouts")}
          </Button>
        </div>
      </div>
    </Card>
  );
};
