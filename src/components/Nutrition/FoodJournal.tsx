import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { commonFoods } from "@/data/commonFoods";
import { FoodSearch } from "./FoodSearch";
import { FoodEntryForm } from "./FoodEntryForm";
import { FoodEntryList } from "./FoodEntryList";
import { FoodEntry } from "@/types/food";

export const FoodJournal = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [newFood, setNewFood] = useState("");
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { toast } = useToast();

  const handleAddEntry = () => {
    if (!newFood || !calories || !proteins) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: newFood,
      calories: Number(calories),
      proteins: Number(proteins),
    };

    setEntries([...entries, newEntry]);
    setNewFood("");
    setCalories("");
    setProteins("");

    toast({
      title: "Aliment ajouté",
      description: "L'aliment a été ajouté à votre journal",
    });
  };

  const handleSelectFood = (foodId: string) => {
    const selectedFood = commonFoods.find((food) => food.id === foodId);
    if (selectedFood) {
      setNewFood(selectedFood.name);
      setCalories(selectedFood.calories.toString());
      setProteins(selectedFood.proteins.toString());
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast({
      title: "Aliment supprimé",
      description: "L'aliment a été supprimé de votre journal",
    });
  };

  const filteredFoods = selectedCategory
    ? commonFoods.filter((food) => food.category === selectedCategory)
    : commonFoods;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal alimentaire</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FoodSearch
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          filteredFoods={filteredFoods}
          onSelectFood={handleSelectFood}
        />
        
        <FoodEntryForm
          newFood={newFood}
          calories={calories}
          proteins={proteins}
          onFoodChange={setNewFood}
          onCaloriesChange={setCalories}
          onProteinsChange={setProteins}
          onAddEntry={handleAddEntry}
        />

        <FoodEntryList
          entries={entries}
          onDeleteEntry={handleDeleteEntry}
        />
      </CardContent>
    </Card>
  );
};