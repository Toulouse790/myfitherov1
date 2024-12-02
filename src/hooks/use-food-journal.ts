import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { commonFoods } from "@/data/commonFoods";
import { FoodEntry } from "@/types/food";

export const useFoodJournal = () => {
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

  return {
    entries,
    newFood,
    calories,
    proteins,
    selectedCategory,
    filteredFoods,
    setNewFood,
    setCalories,
    setProteins,
    setSelectedCategory,
    handleAddEntry,
    handleSelectFood,
    handleBarcodeScan,
    handleDeleteEntry,
  };
};