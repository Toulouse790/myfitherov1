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
import { useQuery } from "@tanstack/react-query";

export const DailyMeals = () => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const { mealPlan } = useDailyTargets();
  const { entriesByMealType } = useFoodEntries();
  const [isCheatMealOpen, setIsCheatMealOpen] = useState(false);
  const [cheatMealSearch, setCheatMealSearch] = useState("");
  const [selectedCheatMeal, setSelectedCheatMeal] = useState<any>(null);
  const { toast } = useToast();

  // Fetch cheat meal library
  const { data: cheatMeals = [] } = useQuery({
    queryKey: ['cheat-meal-library', cheatMealSearch],
    queryFn: async () => {
      const query = supabase
        .from('cheat_meal_library')
        .select('*');
      
      if (cheatMealSearch) {
        query.ilike('name', `%${cheatMealSearch}%`);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  const handleAddCheatMeal = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('food_journal_entries')
        .insert({
          user_id: user.id,
          name: `🍕 ${selectedCheatMeal.name} (Cheat Meal)`,
          calories: selectedCheatMeal.calories,
          proteins: selectedCheatMeal.proteins,
          meal_type: 'cheat_meal'
        });

      if (error) throw error;

      toast({
        title: "Cheat meal ajouté !",
        description: "Le repas a été ajouté à votre journal",
      });

      setIsCheatMealOpen(false);
      setSelectedCheatMeal(null);
      setCheatMealSearch("");
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
                <label className="text-sm font-medium">Rechercher un plat</label>
                <Input
                  placeholder="Ex: Pizza, Burger..."
                  value={cheatMealSearch}
                  onChange={(e) => setCheatMealSearch(e.target.value)}
                />
              </div>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {cheatMeals.map((meal) => (
                    <div
                      key={meal.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedCheatMeal?.id === meal.id
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      onClick={() => setSelectedCheatMeal(meal)}
                    >
                      <div className="font-medium">{meal.name}</div>
                      <div className="text-sm opacity-90">
                        {meal.calories} kcal • {meal.proteins}g protéines
                      </div>
                      <div className="text-xs opacity-75 capitalize">
                        {meal.category === 'food' ? 'Plat' : 
                         meal.category === 'drink' ? 'Boisson' :
                         meal.category === 'alcohol' ? 'Alcool' : 'Dessert'}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button 
                className="w-full" 
                onClick={handleAddCheatMeal}
                disabled={!selectedCheatMeal}
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