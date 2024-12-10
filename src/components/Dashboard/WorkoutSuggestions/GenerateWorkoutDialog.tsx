import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateWorkoutPlan } from "./workoutPlanGenerator";
import { useState, useEffect } from "react";
import { GeneratedWorkoutPreview } from "./GeneratedWorkoutPreview";
import type { WorkoutPlan } from "./workoutPlanGenerator";

interface GenerateWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GenerateWorkoutDialog = ({ open, onOpenChange }: GenerateWorkoutDialogProps) => {
  const { toast } = useToast();
  const [generatedPlan, setGeneratedPlan] = useState<WorkoutPlan | null>(null);
  const [availableExercises, setAvailableExercises] = useState<string[]>([]);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const { data: exercises, error } = await supabase
        .from('unified_exercises')
        .select('id, name')
        .eq('is_published', true);

      if (error) throw error;

      if (exercises) {
        console.log("Exercices disponibles:", exercises.length);
        setAvailableExercises(exercises.map(ex => ex.name));
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des exercices:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les exercices",
        variant: "destructive",
      });
    }
  };

  const handleGenerateWorkout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour générer un programme personnalisé",
        variant: "destructive",
      });
      return;
    }

    const { data: profiles, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible de récupérer votre profil",
        variant: "destructive",
      });
      return;
    }

    if (!profiles || profiles.length === 0) {
      toast({
        title: "Profil incomplet",
        description: "Veuillez d'abord remplir le questionnaire initial",
        variant: "destructive",
      });
      return;
    }

    const profile = profiles[0];
    console.log("Génération du programme avec profil:", profile);

    const userProfile = {
      age: 30,
      weight: 75,
      height: 175,
      goal: profile.objective,
      workoutsPerWeek: parseInt(profile.training_frequency),
      dailyCalories: 2500,
      recoveryCapacity: "medium" as const
    };

    const plan = generateWorkoutPlan(userProfile, availableExercises);
    console.log("Programme généré:", plan);
    setGeneratedPlan(plan);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Générer votre programme personnalisé</DialogTitle>
        </DialogHeader>
        
        {!generatedPlan ? (
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Nous allons utiliser vos réponses au questionnaire initial pour générer un programme adapté à vos objectifs.
              {availableExercises.length > 0 && (
                <span className="block mt-2">
                  {availableExercises.length} exercices disponibles
                </span>
              )}
            </p>
            <Button onClick={handleGenerateWorkout} className="w-full">
              Générer mon programme
            </Button>
          </div>
        ) : (
          <GeneratedWorkoutPreview plan={generatedPlan} />
        )}
      </DialogContent>
    </Dialog>
  );
};