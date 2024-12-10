import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FoodEntryForm } from "./FoodEntryForm";
import { FoodEntryList } from "./FoodEntryList";
import { useToast } from "@/hooks/use-toast";
import { useFoodJournal } from "@/hooks/use-food-journal";

export const FoodJournal = () => {
  const { toast } = useToast();
  const {
    newFood,
    calories,
    proteins,
    carbs,
    fats,
    weight,
    baseCalories,
    selectedCategory,
    setNewFood,
    setCalories,
    setProteins,
    setCarbs,
    setFats,
    setWeight,
    setSelectedCategory,
    handleAddEntry,
    handleDeleteEntry,
    entries
  } = useFoodJournal();

  const handleAddEntryWithLogging = async (mealType: string) => {
    try {
      await handleAddEntry(mealType);
      toast({
        title: "Succès",
        description: "L'aliment a été ajouté à votre journal",
      });
    } catch (error) {
      console.error('Error adding food entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'aliment",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <FoodEntryForm
          newFood={newFood}
          calories={calories}
          proteins={proteins}
          carbs={carbs}
          fats={fats}
          weight={weight}
          baseCalories={baseCalories}
          selectedCategory={selectedCategory}
          onFoodChange={setNewFood}
          onCaloriesChange={setCalories}
          onProteinsChange={setProteins}
          onCarbsChange={setCarbs}
          onFatsChange={setFats}
          onWeightChange={setWeight}
          onAddEntry={handleAddEntryWithLogging}
        />
        
        <div className="mt-8">
          <FoodEntryList 
            entries={entries}
            onDelete={handleDeleteEntry}
          />
        </div>
      </CardContent>
    </Card>
  );
};