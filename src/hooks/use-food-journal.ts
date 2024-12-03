import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { commonFoods } from "@/data/commonFoods";
import { FoodEntry } from "@/types/food";
import { supabase } from "@/integrations/supabase/client";

export const useFoodJournal = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [newFood, setNewFood] = useState("");
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  // Charger les entrées au démarrage
  useEffect(() => {
    loadEntries();
  }, []);

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('food_journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setEntries(data.map(entry => ({
        id: entry.id,
        name: entry.name,
        calories: entry.calories,
        proteins: entry.proteins,
      })));
    } catch (error) {
      console.error('Error loading entries:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le journal alimentaire",
        variant: "destructive",
      });
    }
  };

  const handleAddEntry = async () => {
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

      const { data, error } = await supabase
        .from('food_journal_entries')
        .insert({
          user_id: user.id,
          name: newFood,
          calories: parseInt(calories),
          proteins: parseInt(proteins),
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: FoodEntry = {
        id: data.id,
        name: data.name,
        calories: data.calories,
        proteins: data.proteins,
      };

      setEntries([newEntry, ...entries]);
      setNewFood("");
      setCalories("");
      setProteins("");

      toast({
        title: "Aliment ajouté",
        description: "L'aliment a été ajouté à votre journal",
      });
    } catch (error) {
      console.error('Error adding entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'aliment",
        variant: "destructive",
      });
    }
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

  const handleDeleteEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('food_journal_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setEntries(entries.filter((entry) => entry.id !== id));
      toast({
        title: "Aliment supprimé",
        description: "L'aliment a été supprimé de votre journal",
      });
    } catch (error) {
      console.error('Error deleting entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'aliment",
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