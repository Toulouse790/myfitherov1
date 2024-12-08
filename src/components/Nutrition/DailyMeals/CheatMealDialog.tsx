import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MealTypeSelect } from "./CheatMeal/MealTypeSelect";
import { SearchInput } from "./CheatMeal/SearchInput";
import { CheatMealTabs } from "./CheatMeal/CheatMealTabs";
import { SelectedMeals } from "./CheatMeal/SelectedMeals";

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

      // Supprimer d'abord les repas existants pour ce type de repas
      const { error: deleteError } = await supabase
        .from('food_journal_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('meal_type', selectedMealType)
        .gte('created_at', new Date().setHours(0, 0, 0, 0))
        .lt('created_at', new Date().setHours(23, 59, 59, 999));

      if (deleteError) throw deleteError;

      // Ajouter les nouveaux cheat meals
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Ajouter des Cheat Meals</DialogTitle>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4 overflow-y-auto pb-20">
          <MealTypeSelect 
            value={selectedMealType}
            onChange={setSelectedMealType}
          />

          <SearchInput
            value={cheatMealSearch}
            onChange={setCheatMealSearch}
          />

          <CheatMealTabs
            meals={cheatMeals}
            selectedMeals={selectedCheatMeals}
            onToggleMeal={handleToggleCheatMeal}
          />

          <SelectedMeals
            meals={selectedCheatMeals}
            onRemoveMeal={handleToggleCheatMeal}
          />
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