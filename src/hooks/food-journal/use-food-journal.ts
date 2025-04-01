
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FoodEntry } from "@/types/food";
import { useToast } from "@/hooks/use-toast";
import { loadFoodEntries, addFoodEntry, deleteFoodEntry } from "./database";
import { useFoodValidation } from "./validation";
import { CommonFood } from "@/types/food";

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
  const [filteredFoods, setFilteredFoods] = useState<CommonFood[]>([]);
  const { toast } = useToast();
  const { validateFoodEntry } = useFoodValidation();
  
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

  const {
    data,
    isLoading,
    isError,
    refetch: refetchEntries
  } = useQuery({
    queryKey: ['food-journal-entries'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Vous devez être connecté pour voir votre journal");
      }
      return loadFoodEntries(user.id);
    },
  });

  const handleDeleteEntry = async (id: string) => {
    try {
      await deleteFoodEntry(id);
      await refetchEntries();
      toast({
        title: "Succès",
        description: "L'entrée a été supprimée avec succès",
      });
    } catch (error) {
      console.error("Error deleting food entry:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'entrée",
        variant: "destructive",
      });
    }
  };

  const handleAddEntry = async (mealType: string) => {
    // Validation des entrées
    if (!validateFoodEntry(newFood, calories, proteins, carbs, fats)) {
      return null;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Connexion requise",
          description: "Vous devez être connecté pour ajouter un aliment",
          variant: "destructive",
        });
        return null;
      }

      // Vérifier les doublons
      const isDuplicate = await checkDuplicateEntry(newFood, mealType);
      if (isDuplicate) {
        toast({
          title: "Attention",
          description: `${newFood} a déjà été ajouté à ${mealType} aujourd'hui`,
          variant: "default",
        });

        // L'utilisateur peut quand même l'ajouter s'il le souhaite
        if (!confirm("Voulez-vous quand même ajouter cet aliment ?")) {
          return null;
        }
      }

      const entry = {
        user_id: user.id,
        name: newFood,
        calories: calories,
        proteins: proteins,
        carbs: carbs,
        fats: fats,
        meal_type: mealType,
        notes: notes
      };

      const result = await addFoodEntry(user.id, entry);

      // Reset form fields
      setNewFood("");
      setCalories(0);
      setProteins(0);
      setCarbs(0);
      setFats(0);
      setNotes("");
      
      // Refresh entries
      await refetchEntries();
      
      toast({
        title: "Succès",
        description: `${newFood} a été ajouté à votre journal`,
        variant: "default",
      });
      
      return result;
    } catch (error) {
      console.error("Error adding food entry:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'aliment",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSelectFood = (foodId: string) => {
    // Implementation pour sélectionner un aliment dans la liste des aliments courants
  };

  const handleBarcodeScan = async (barcode: string): Promise<FoodEntry | null> => {
    try {
      console.log("Scanning barcode:", barcode);
      
      // Simuler une recherche dans une base de données d'aliments
      // Dans une implémentation réelle, cela ferait une requête à une API de produits alimentaires
      const isProductFound = Math.random() > 0.3; // 70% de chance de trouver le produit
      
      if (isProductFound) {
        // Produit trouvé, on crée une entrée avec des valeurs simulées
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Connexion requise",
            description: "Vous devez être connecté pour ajouter un aliment",
            variant: "destructive",
          });
          return null;
        }
        
        // Créer des données simulées basées sur le code-barres
        const productName = `Produit ${barcode.substring(0, 4)}`;
        const randomCalories = Math.floor(Math.random() * 500) + 100;
        const randomProteins = Math.floor(Math.random() * 30);
        const randomCarbs = Math.floor(Math.random() * 50);
        const randomFats = Math.floor(Math.random() * 20);
        
        // Ajouter l'entrée à la base de données
        const entry = {
          user_id: user.id,
          name: productName,
          calories: randomCalories,
          proteins: randomProteins,
          carbs: randomCarbs,
          fats: randomFats,
          meal_type: "snack", // Par défaut
          notes: `Scanné via code-barres: ${barcode}`
        };
        
        const result = await addFoodEntry(user.id, entry);
        
        // Rafraîchir la liste des entrées
        await refetchEntries();
        
        return {
          id: result.id,
          name: productName,
          calories: randomCalories,
          proteins: randomProteins,
          carbs: randomCarbs,
          fats: randomFats,
          mealType: "snack",
          notes: `Scanné via code-barres: ${barcode}`,
          created_at: new Date().toISOString()
        };
      }
      
      return null; // Produit non trouvé
    } catch (error) {
      console.error("Error scanning barcode:", error);
      return null;
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
    filteredFoods,
    setNewFood,
    setCalories,
    setProteins,
    setCarbs,
    setFats,
    setWeight,
    setNotes,
    setSelectedCategory,
    handleAddEntry,
    handleSelectFood,
    handleBarcodeScan,
    handleDeleteEntry,
    entries: data || [],
    isLoading,
    isError,
    refetchEntries
  };
};
