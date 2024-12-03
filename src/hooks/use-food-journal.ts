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

  const loadEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found, skipping loadEntries");
        return;
      }

      const { data, error } = await supabase
        .from('food_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading entries:', error);
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
        return;
      }

      if (data) {
        setEntries(data.map(entry => ({
          id: entry.id,
          name: entry.name,
          calories: entry.calories,
          proteins: entry.proteins,
        })));
      }
    } catch (error: any) {
      console.error('Error in loadEntries:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement du journal",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

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

      if (error) {
        console.error('Error adding entry:', error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter l'aliment",
          variant: "destructive",
        });
        return;
      }

      if (data) {
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
      }
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

      if (error) {
        console.error('Error deleting entry:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'aliment",
          variant: "destructive",
        });
        return;
      }

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