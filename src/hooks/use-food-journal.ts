
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FoodEntry } from "@/types/food";
import { useToast } from "@/hooks/use-toast";

export const useFoodJournal = () => {
  const [newFood, setNewFood] = useState("");
  const [calories, setCalories] = useState(0);
  const [proteins, setProteins] = useState(0);
  const [carbs, setCarbs] = useState(0);
  const [fats, setFats] = useState(0);
  const [weight, setWeight] = useState(100);
  const [notes, setNotes] = useState("");
  const [baseCalories, setBaseCalories] = useState(100);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchEntries = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Vous devez être connecté pour voir votre journal");
    }

    const { data, error } = await supabase
      .from('food_journal_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data as FoodEntry[];
  };

  const {
    data,
    isLoading,
    isError,
    refetch: refetchEntries
  } = useQuery({
    queryKey: ['food-journal-entries'],
    queryFn: fetchEntries,
  });

  // Fonction pour vérifier les entrées en double
  const checkDuplicateEntry = async (name: string, mealType: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Vérifier si une entrée avec le même nom et type de repas existe déjà aujourd'hui
      const today = new Date();
      const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
      const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

      const { data, error } = await supabase
        .from('food_journal_entries')
        .select('id, name')
        .eq('user_id', user.id)
        .eq('name', name)
        .eq('meal_type', mealType)
        .gte('created_at', startOfDay)
        .lte('created_at', endOfDay);

      if (error) {
        console.error("Erreur lors de la vérification des doublons:", error);
        return false;
      }

      return data && data.length > 0;
    } catch (error) {
      console.error("Erreur lors de la vérification des doublons:", error);
      return false;
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour supprimer un aliment");
      }

      const { error } = await supabase
        .from('food_journal_entries')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Refresh entries
      await refetchEntries();

    } catch (error) {
      console.error("Error deleting food entry:", error);
      throw error;
    }
  };

  const handleAddEntry = async (mealType: string) => {
    if (!newFood) {
      throw new Error("Le nom de l'aliment est requis");
    }

    if (calories <= 0) {
      throw new Error("Les calories doivent être supérieures à 0");
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour ajouter un aliment");
      }

      // Vérifier les doublons
      const isDuplicate = await checkDuplicateEntry(newFood, mealType);
      if (isDuplicate) {
        toast({
          title: "Attention",
          description: `${newFood} a déjà été ajouté à ${mealType} aujourd'hui`,
          variant: "default", // Changé de "warning" à "default" car "warning" n'est pas un type valide
        });

        // L'utilisateur peut quand même l'ajouter s'il le souhaite
        if (!confirm("Voulez-vous quand même ajouter cet aliment ?")) {
          return null;
        }
      }

      const { data, error } = await supabase
        .from('food_journal_entries')
        .insert([{
          user_id: user.id,
          name: newFood,
          calories: calories,
          proteins: proteins,
          carbs: carbs,
          fats: fats,
          meal_type: mealType,
          notes: notes
        }]);

      if (error) {
        throw error;
      }

      // Reset form fields
      setNewFood("");
      setCalories(0);
      setProteins(0);
      setCarbs(0);
      setFats(0);
      setNotes("");
      
      // Refresh entries
      await refetchEntries();
      
      return data;
    } catch (error) {
      console.error("Error adding food entry:", error);
      throw error;
    }
  };

  return {
    newFood,
    calories,
    proteins,
    carbs,
    fats,
    weight,
    notes,
    baseCalories,
    selectedCategory,
    setNewFood,
    setCalories,
    setProteins,
    setCarbs,
    setFats,
    setWeight,
    setNotes,
    setSelectedCategory,
    handleAddEntry,
    handleDeleteEntry,
    entries: data || [],
    isLoading,
    isError,
    refetchEntries
  };
};
