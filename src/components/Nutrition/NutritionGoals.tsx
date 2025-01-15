import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NutrientTargets {
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
}

const defaultNutrients: NutrientTargets = {
  calories: 0,
  proteins: 0,
  carbs: 0,
  fats: 0
};

export const NutritionGoals = () => {
  const { dailyTargets, consumedNutrients } = useDailyTargets();
  const { toast } = useToast();

  const handleMealStatus = async (status: 'taken' | 'skipped') => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      toast({
        title: status === 'taken' ? "Repas validé" : "Repas non pris",
        description: status === 'taken' 
          ? "Le repas a été ajouté à votre journal" 
          : "Le repas a été marqué comme non pris",
      });

      // Reload to refresh the data
      window.location.reload();
    } catch (error) {
      console.error('Error updating meal status:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du repas",
        variant: "destructive",
      });
    }
  };

  const calculateProgress = (consumed: number = 0, target: number = 0) => {
    if (!target) return 0;
    return Math.min(Math.round((consumed / target) * 100), 100);
  };

  const targets = dailyTargets || defaultNutrients;
  const consumed = consumedNutrients || defaultNutrients;

  if (!targets) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-medium">Objectifs journaliers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Chargement...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Objectifs journaliers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Calories</span>
            <div className="flex items-center gap-2">
              <span>{consumed.calories} / {targets.calories} kcal</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMealStatus('skipped')}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-6 w-6"
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleMealStatus('taken')}
                className="text-green-500 hover:text-green-600 hover:bg-green-50 h-6 w-6"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <Progress value={calculateProgress(consumed.calories, targets.calories)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Protéines</span>
            <span>{consumed.proteins} / {targets.proteins}g</span>
          </div>
          <Progress value={calculateProgress(consumed.proteins, targets.proteins)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Glucides</span>
            <span>{consumed.carbs} / {targets.carbs}g</span>
          </div>
          <Progress value={calculateProgress(consumed.carbs, targets.carbs)} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs sm:text-sm">
            <span>Lipides</span>
            <span>{consumed.fats} / {targets.fats}g</span>
          </div>
          <Progress value={calculateProgress(consumed.fats, targets.fats)} />
        </div>
      </CardContent>
    </Card>
  );
};