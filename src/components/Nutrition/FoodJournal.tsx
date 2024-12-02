import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { commonFoods } from "@/data/commonFoods";
import { FoodSearch } from "./FoodSearch";
import { FoodEntryForm } from "./FoodEntryForm";
import { FoodEntryList } from "./FoodEntryList";
import { BarcodeScanner } from "./BarcodeScanner";
import { FoodEntry } from "@/types/food";

interface FoodJournalProps {
  userAllergies?: string[];
}

export const FoodJournal = ({ userAllergies = [] }: FoodJournalProps) => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [newFood, setNewFood] = useState("");
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
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

  const handleBarcodeScan = async (barcode: string) => {
    // Ici, vous pourriez appeler une API pour obtenir les informations nutritionnelles
    // Pour l'exemple, nous allons simuler une recherche dans commonFoods
    const scannedFood = commonFoods.find((food) => food.id === barcode);
    
    if (scannedFood) {
      setNewFood(scannedFood.name);
      setCalories(scannedFood.calories.toString());
      setProteins(scannedFood.proteins.toString());
    } else {
      toast({
        title: "Produit non trouvé",
        description: "Ce produit n'est pas dans notre base de données",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast({
      title: "Aliment supprimé",
      description: "L'aliment a été supprimé de votre journal",
    });
  };

  const filteredFoods = selectedCategory === "all"
    ? commonFoods
    : commonFoods.filter((food) => food.category === selectedCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal alimentaire</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BarcodeScanner onScan={handleBarcodeScan} />
        
        <FoodSearch
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          filteredFoods={filteredFoods}
          onSelectFood={handleSelectFood}
          userAllergies={userAllergies}
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