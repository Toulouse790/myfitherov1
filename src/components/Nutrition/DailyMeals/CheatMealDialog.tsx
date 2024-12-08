import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CheatMealDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CheatMealDialog = ({ isOpen, onOpenChange }: CheatMealDialogProps) => {
  const [cheatMealSearch, setCheatMealSearch] = useState("");
  const [selectedCheatMeals, setSelectedCheatMeals] = useState<any[]>([]);
  const [selectedMealType, setSelectedMealType] = useState<string>("lunch");
  const { toast } = useToast();

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
        meal_type: selectedMealType
      }));

      const { error } = await supabase
        .from('food_journal_entries')
        .insert(entries);

      if (error) throw error;

      toast({
        title: "Cheat meals ajoutés !",
        description: `${entries.length} repas ont été ajoutés en remplacement du ${selectedMealType === 'lunch' ? 'déjeuner' : 'dîner'}`,
      });

      onOpenChange(false);
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
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Ajouter des Cheat Meals</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pb-20">
          <div className="space-y-2">
            <label className="text-sm font-medium">Remplacer</label>
            <Select value={selectedMealType} onValueChange={setSelectedMealType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir le repas à remplacer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lunch">Déjeuner</SelectItem>
                <SelectItem value="dinner">Dîner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Rechercher</label>
            <Input
              placeholder="Ex: Pizza, Burger..."
              value={cheatMealSearch}
              onChange={(e) => setCheatMealSearch(e.target.value)}
              className="w-full"
            />
          </div>

          <Tabs defaultValue="food" className="w-full">
            <TabsList className="w-full grid grid-cols-4 h-auto">
              <TabsTrigger value="food" className="text-xs sm:text-sm py-2">Plats</TabsTrigger>
              <TabsTrigger value="drink" className="text-xs sm:text-sm py-2">Boissons</TabsTrigger>
              <TabsTrigger value="alcohol" className="text-xs sm:text-sm py-2">Alcool</TabsTrigger>
              <TabsTrigger value="dessert" className="text-xs sm:text-sm py-2">Desserts</TabsTrigger>
            </TabsList>

            {['food', 'drink', 'alcohol', 'dessert'].map((category) => (
              <TabsContent key={category} value={category} className="mt-4">
                <ScrollArea className="h-[40vh] sm:h-[45vh]">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
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
                              <div className="font-medium text-sm sm:text-base">{meal.name}</div>
                              <div className="text-xs sm:text-sm opacity-90">
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
                    className="flex items-center gap-1 text-xs sm:text-sm"
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
              <div className="text-xs sm:text-sm text-muted-foreground">
                Total: {getTotalCalories()} kcal • {getTotalProteins()}g protéines
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t">
          <Button 
            className="w-full py-4 text-base"
            onClick={handleAddCheatMeals}
            disabled={selectedCheatMeals.length === 0}
          >
            Remplacer {selectedMealType === 'lunch' ? 'le déjeuner' : 'le dîner'} par {selectedCheatMeals.length} élément{selectedCheatMeals.length > 1 ? 's' : ''}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};