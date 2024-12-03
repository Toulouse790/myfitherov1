import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateWorkoutPlan } from "./workoutPlanGenerator";

interface GenerateWorkoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GenerateWorkoutDialog = ({ open, onOpenChange }: GenerateWorkoutDialogProps) => {
  const { toast } = useToast();

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

    const { data: profile } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      toast({
        title: "Profil incomplet",
        description: "Veuillez d'abord remplir le questionnaire initial",
        variant: "destructive",
      });
      return;
    }

    const userProfile = {
      age: 30,
      weight: 75,
      height: 175,
      goal: profile.objective,
      workoutsPerWeek: parseInt(profile.training_frequency),
      dailyCalories: 2500,
      recoveryCapacity: "medium" as const
    };

    const plan = generateWorkoutPlan(userProfile);
    onOpenChange(false);
    
    toast({
      title: "Programme généré avec succès",
      description: `Programme personnalisé créé avec :
      - ${plan.volume} séries au total
      - Intensité : ${Math.round(plan.intensity * 100)}%
      - ${plan.recommendedRest}s de repos entre les séries
      - ${plan.setsAndReps.sets} séries de ${plan.setsAndReps.reps} répétitions
      - ${plan.weeklySchedule.daysPerWeek} jours par semaine`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Générer votre programme personnalisé</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Nous allons utiliser vos réponses au questionnaire initial pour générer un programme adapté à vos objectifs.
          </p>
          <Button onClick={handleGenerateWorkout} className="w-full">
            Générer mon programme
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};