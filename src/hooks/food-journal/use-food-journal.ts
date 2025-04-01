
import { useQuery } from "@tanstack/react-query";
import { FoodEntry } from "@/types/food";
import { useToast } from "@/hooks/use-toast";
import { 
  loadFoodEntries, 
  addFoodEntry, 
  deleteFoodEntry,
  checkDuplicateEntry
} from "./database";
import { useFoodValidation } from "./validation";
import { useBarcodeScan } from "./use-barcode-scan";
import { useFoodInput } from "./use-food-input";

export const useFoodJournal = () => {
  const { toast } = useToast();
  const { validateFoodEntry } = useFoodValidation();
  const { handleBarcodeScan } = useBarcodeScan();
  const {
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
    setFilteredFoods
  } = useFoodInput();

  const {
    data,
    isLoading,
    isError,
    refetch: refetchEntries
  } = useQuery({
    queryKey: ['food-journal-entries'],
    queryFn: loadFoodEntries,
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
        name: newFood,
        calories: calories,
        proteins: proteins,
        carbs: carbs,
        fats: fats,
        mealType: mealType,
        notes: notes
      };

      const result = await addFoodEntry(entry);

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
    setFilteredFoods,
    handleAddEntry,
    handleBarcodeScan,
    handleDeleteEntry,
    entries: data || [],
    isLoading,
    isError,
    refetchEntries
  };
};
