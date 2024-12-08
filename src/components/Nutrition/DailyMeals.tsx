import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mealTypes } from "./DailyMeals/MealTypes";
import { MealSection } from "./DailyMeals/MealSection";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useFoodEntries } from "@/hooks/use-food-entries";
import { Button } from "@/components/ui/button";
import { Pizza } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const DailyMeals = () => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const { mealPlan } = useDailyTargets();
  const { entriesByMealType } = useFoodEntries();
  const [isCheatMealOpen, setIsCheatMealOpen] = useState(false);
  const [cheatMealName, setCheatMealName] = useState("");
  const [cheatMealCalories, setCheatMealCalories] = useState("");
  const [cheatMealProteins, setCheatMealProteins] = useState("");
  const { toast } = useToast();

  const handleAddCheatMeal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('food_journal_entries')
        .insert({
          user_id: user.id,
          name: `🍕 ${cheatMealName} (Cheat Meal)`,
          calories: parseInt(cheatMealCalories),
          proteins: parseInt(cheatMealProteins),
          meal_type: 'cheat_meal'
        });

      if (error) throw error;

      toast({
        title: "Cheat meal ajouté !",
        description: "Le repas a été ajouté à votre journal",
      });

      setIsCheatMealOpen(false);
      setCheatMealName("");
      setCheatMealCalories("");
      setCheatMealProteins("");
    } catch (error) {
      console.error('Error adding cheat meal:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le cheat meal",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm sm:text-base">Repas du jour</CardTitle>
        <Dialog open={isCheatMealOpen} onOpenChange={setIsCheatMealOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Pizza className="w-4 h-4" />
              <span className="hidden sm:inline">Cheat Meal</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un Cheat Meal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom du repas</label>
                <Input
                  placeholder="Ex: Pizza 4 fromages"
                  value={cheatMealName}
                  onChange={(e) => setCheatMealName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Calories estimées</label>
                <Input
                  type="number"
                  placeholder="Ex: 800"
                  value={cheatMealCalories}
                  onChange={(e) => setCheatMealCalories(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Protéines estimées (g)</label>
                <Input
                  type="number"
                  placeholder="Ex: 25"
                  value={cheatMealProteins}
                  onChange={(e) => setCheatMealProteins(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleAddCheatMeal}
                disabled={!cheatMealName || !cheatMealCalories || !cheatMealProteins}
              >
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <ScrollArea className="h-[300px] sm:h-[400px] pr-2 sm:pr-4">
          <div className="space-y-2 sm:space-y-3">
            {Object.entries(mealTypes).map(([type, label]) => (
              <MealSection
                key={type}
                type={type}
                label={label}
                mealEntries={entriesByMealType[type] || []}
                generatedMeal={{
                  name: "Suggestion basée sur vos objectifs",
                  calories: mealPlan[type]?.calories || 0,
                  proteins: mealPlan[type]?.proteins || 0,
                  notes: `Objectif: ${mealPlan[type]?.calories || 0} kcal, ${mealPlan[type]?.proteins || 0}g protéines`
                }}
                isExpanded={expandedMeal === type}
                onToggle={() => setExpandedMeal(expandedMeal === type ? null : type)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};