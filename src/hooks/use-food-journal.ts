import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { commonFoods } from "@/data/commonFoods";
import { FoodEntry } from "@/types/food";
import { supabase } from "@/integrations/supabase/client";
import { loadFoodEntries, addFoodEntry, deleteFoodEntry } from "./food-journal/database";
import { FoodJournalState, FoodJournalActions } from "./food-journal/types";

export const useFoodJournal = (): FoodJournalState & FoodJournalActions => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [newFood, setNewFood] = useState("");
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [weight, setWeight] = useState("");
  const [baseCalories, setBaseCalories] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No user found, skipping loadEntries");
          return;
        }

        const { data, error } = await supabase
          .from("food_journal_entries")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        setEntries(data.map(entry => ({
          id: entry.id,
          name: entry.name,
          calories: entry.calories,
          proteins: entry.proteins,
          mealType: entry.meal_type,
        })));
      } catch (error: any) {
        console.error('Error in loadEntries:', error);
        if (error.code === '42P01') {
          toast({
            title: "Initialisation en cours",
            description: "La base de données est en cours d'initialisation. Veuillez patienter quelques instants.",
          });
        } else {
          toast({
            title: "Erreur",
            description: "Impossible de charger le journal alimentaire",
            variant: "destructive",
          });
        }
      }
    };

    loadEntries();
  }, []);

  const handleAddEntry = async (mealType: string) => {
    if (!newFood || !calories || !proteins) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour ajouter des aliments",
          variant: "destructive",
        });
        return;
      }

      const data = await addFoodEntry(user.id, {
        name: `${newFood} (${weight}g)`,
        calories: parseInt(calories),
        proteins: parseInt(proteins),
        mealType: mealType,
      });

      const newEntry: FoodEntry = {
        id: data.id,
        name: data.name,
        calories: data.calories,
        proteins: data.proteins,
        mealType: data.meal_type,
      };

      setEntries([newEntry, ...entries]);
      setNewFood("");
      setCalories("");
      setProteins("");
      setWeight("");
      setBaseCalories(0);

      toast({
        title: "Aliment ajouté",
        description: "L'aliment a été ajouté à votre journal",
      });
    } catch (error: any) {
      console.error('Error in handleAddEntry:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de l'aliment",
        variant: "destructive",
      });
    }
  };

  const handleSelectFood = (foodId: string) => {
    const selectedFood = commonFoods.find((food) => food.id === foodId);
    if (selectedFood) {
      setNewFood(selectedFood.name);
      setBaseCalories(selectedFood.calories);
      setProteins(selectedFood.proteins.toString());
      setSelectedCategory(selectedFood.category);
      setWeight("");
      setCalories("");
    }
  };

  const handleBarcodeScan = async (barcode: string) => {
    const scannedFood = commonFoods.find((food) => food.id === barcode);
    
    if (scannedFood) {
      setNewFood(scannedFood.name);
      setBaseCalories(scannedFood.calories);
      setProteins(scannedFood.proteins.toString());
      setSelectedCategory(scannedFood.category);
      setWeight("");
      setCalories("");
    } else {
      toast({
        title: "Produit non trouvé",
        description: "Ce produit n'est pas dans notre base de données",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteFoodEntry(id);
      setEntries(entries.filter((entry) => entry.id !== id));
      toast({
        title: "Aliment supprimé",
        description: "L'aliment a été supprimé de votre journal",
      });
    } catch (error: any) {
      console.error('Error in handleDeleteEntry:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'aliment",
        variant: "destructive",
      });
    }
  };

  const filteredFoods = selectedCategory === "all"
    ? commonFoods
    : commonFoods.filter((food) => food.category === selectedCategory);

  return {
    entries,
    newFood,
    calories,
    proteins,
    weight,
    baseCalories,
    selectedCategory,
    filteredFoods,
    setNewFood,
    setCalories,
    setProteins,
    setWeight,
    setSelectedCategory,
    handleAddEntry,
    handleSelectFood,
    handleBarcodeScan,
    handleDeleteEntry,
  };
};