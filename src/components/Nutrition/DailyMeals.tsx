import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mealTypes } from "./DailyMeals/MealTypes";
import { MealSection } from "./DailyMeals/MealSection";
import { useDailyTargets } from "@/hooks/use-daily-targets";
import { useFoodEntries } from "@/hooks/use-food-entries";
import { Button } from "@/components/ui/button";
import { Pizza, Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export const DailyMeals = () => {
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const { mealPlan } = useDailyTargets();
  const { entriesByMealType } = useFoodEntries();
  const [isCheatMealOpen, setIsCheatMealOpen] = useState(false);
  const [cheatMealSearch, setCheatMealSearch] = useState("");
  const [selectedCheatMeals, setSelectedCheatMeals] = useState<any[]>([]);
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

  const handleToggleCheatMeal = (meal: any) => {
    setSelectedCheatMeals(prev => {
      const exists = prev.find(m => m.id === meal.id);
      if (exists) {
        return prev.filter(m => m.id !== meal.id);
      } else {
        return [...prev, meal];
      }
    });
  };

  const handleAddCheatMeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const entries = selectedCheatMeals.map(meal => ({
        user_id: user.id,
        name: `🍕 ${meal.name} (Cheat Meal)`,
        calories: meal.calories,
        proteins: meal.proteins,
        meal_type: 'cheat_meal'
      }));

      const { error } = await supabase
        .from('food_journal_entries')
        .insert(entries);

      if (error) throw error;

      toast({
        title: "Cheat meals ajoutés !",
        description: `${entries.length} repas ont été ajoutés à votre journal`,
      });

      setIsCheatMealOpen(false);
      setSelectedCheatMeals([]);
      setCheatMealSearch("");
    } catch (error) {
      console.error('Error adding cheat meals:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter les cheat meals",
        variant: "destructive",
      });
    }
  };

  const getTotalCalories = () => {
    return selectedCheatMeals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  const getTotalProteins = () => {
    return selectedCheatMeals.reduce((sum, meal) => sum + meal.proteins, 0);
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Ajouter des Cheat Meals</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rechercher</label>
                <Input
                  placeholder="Ex: Pizza, Burger..."
                  value={cheatMealSearch}
                  onChange={(e) => setCheatMealSearch(e.target.value)}
                />
              </div>

              <Tabs defaultValue="food" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="food">Plats</TabsTrigger>
                  <TabsTrigger value="drink">Boissons</TabsTrigger>
                  <TabsTrigger value="alcohol">Alcool</TabsTrigger>
                  <TabsTrigger value="dessert">Desserts</TabsTrigger>
                </TabsList>

                {['food', 'drink', 'alcohol', 'dessert'].map((category) => (
                  <TabsContent key={category} value={category} className="mt-4">
                    <ScrollArea className="h-[300px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {cheatMeals
                          .filter(meal => meal.category === category)
                          .map((meal) => (
                            <div
                              key={meal.id}
                              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedCheatMeals.some(m => m.id === meal.id)
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted'
                              }`}
                              onClick={() => handleToggleCheatMeal(meal)}
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="font-medium">{meal.name}</div>
                                  <div className="text-sm opacity-90">
                                    {meal.calories} kcal • {meal.proteins}g protéines
                                  </div>
                                </div>
                                {selectedCheatMeals.some(m => m.id === meal.id) && (
                                  <Plus className="w-4 h-4" />
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                ))}
              </Tabs>

              {selectedCheatMeals.length > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="font-medium">Sélection ({selectedCheatMeals.length})</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCheatMeals.map((meal) => (
                      <Badge
                        key={meal.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {meal.name}
                        <Trash2
                          className="w-3 h-3 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCheatMeal(meal);
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total: {getTotalCalories()} kcal • {getTotalProteins()}g protéines
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                className="w-full" 
                onClick={handleAddCheatMeals}
                disabled={selectedCheatMeals.length === 0}
              >
                Ajouter {selectedCheatMeals.length} élément{selectedCheatMeals.length > 1 ? 's' : ''}
              </Button>
            </DialogFooter>
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