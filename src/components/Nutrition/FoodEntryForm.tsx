import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { MealTypeSelect } from "./FoodEntry/MealTypeSelect";
import { FoodInputs } from "./FoodEntry/FoodInputs";
import { ActionButtons } from "./FoodEntry/ActionButtons";

interface FoodEntryFormProps {
  newFood: string;
  calories: string;
  proteins: string;
  weight: string;
  baseCalories: number;
  selectedCategory: string;
  onFoodChange: (value: string) => void;
  onCaloriesChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onAddEntry: () => void;
}

export const FoodEntryForm = ({
  newFood,
  calories,
  proteins,
  weight,
  baseCalories,
  selectedCategory,
  onFoodChange,
  onCaloriesChange,
  onProteinsChange,
  onWeightChange,
  onAddEntry,
}: FoodEntryFormProps) => {
  const { toast } = useToast();
  const [selectedMealType, setSelectedMealType] = useState("");
  const [isCustomFood, setIsCustomFood] = useState(false);

  const handleWeightChange = (value: string) => {
    onWeightChange(value);
    if (baseCalories > 0 && value) {
      const newCalories = Math.round((baseCalories * parseInt(value)) / 100);
      onCaloriesChange(newCalories.toString());
    }
  };

  const handleSuggestFood = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour suggérer un aliment",
          variant: "destructive",
        });
        return;
      }

      if (!newFood || !calories || !proteins) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
        });
        return;
      }

      await supabase.from('user_suggested_foods').insert({
        user_id: user.id,
        name: newFood,
        calories: parseInt(calories),
        proteins: parseInt(proteins),
        category: selectedCategory || "Autres"
      });

      toast({
        title: "Suggestion envoyée",
        description: "Votre suggestion d'aliment a été enregistrée et sera examinée",
      });

      onFoodChange("");
      onCaloriesChange("");
      onProteinsChange("");
      onWeightChange("");
      setIsCustomFood(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la suggestion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white border border-gray-200">
        <div className="flex flex-col gap-4">
          <MealTypeSelect 
            value={selectedMealType}
            onChange={setSelectedMealType}
          />

          <FoodInputs
            newFood={newFood}
            weight={weight}
            calories={calories}
            proteins={proteins}
            isCustomFood={isCustomFood}
            onFoodChange={onFoodChange}
            onWeightChange={handleWeightChange}
            onCaloriesChange={onCaloriesChange}
            onProteinsChange={onProteinsChange}
            setIsCustomFood={setIsCustomFood}
          />

          <ActionButtons
            isCustomFood={isCustomFood}
            onSuggest={handleSuggestFood}
            onAdd={onAddEntry}
          />
        </div>
      </Card>
    </div>
  );
};