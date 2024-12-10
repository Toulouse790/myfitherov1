import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FoodEntryForm } from "./FoodEntryForm";
import { BarcodeScanner } from "./BarcodeScanner";
import { useFoodJournal } from "@/hooks/use-food-journal";
import { Clock8 } from "lucide-react";
import { FoodSearch } from "./FoodSearch";
import { useAiTraining } from "@/hooks/use-ai-training";

interface FoodJournalProps {
  userAllergies?: string[];
}

export const FoodJournal = ({ userAllergies = [] }: FoodJournalProps) => {
  const {
    entries,
    newFood,
    calories,
    proteins,
    weight,
    baseCalories,
    selectedCategory,
    setNewFood,
    setCalories,
    setProteins,
    setWeight,
    setSelectedCategory,
    handleAddEntry,
    handleBarcodeScan,
    handleDeleteEntry,
  } = useFoodJournal();

  const { logAiInteraction } = useAiTraining();

  // Get current hour to determine greeting and meal suggestion
  const currentHour = new Date().getHours();
  let greeting = "";
  let mealSuggestion = "";

  if (currentHour >= 5 && currentHour < 11) {
    greeting = "Bonjour !";
    mealSuggestion = "Qu'avez-vous pris au petit-déjeuner ?";
  } else if (currentHour >= 11 && currentHour < 14) {
    greeting = "Bon appétit !";
    mealSuggestion = "Ajoutez votre déjeuner";
  } else if (currentHour >= 14 && currentHour < 17) {
    greeting = "L'après-midi est là !";
    mealSuggestion = "Une petite collation ?";
  } else if (currentHour >= 17 && currentHour < 22) {
    greeting = "Bonne soirée !";
    mealSuggestion = "Qu'avez-vous prévu pour le dîner ?";
  } else {
    greeting = "Bonsoir !";
    mealSuggestion = "Un petit encas avant de dormir ?";
  }

  const handleAddEntryWithLogging = async (mealType: string) => {
    await logAiInteraction(
      "food_entry_add",
      {
        food: newFood,
        calories,
        proteins,
        mealType,
        hour: currentHour
      },
      "Food entry added successfully",
      "gpt-3.5-turbo",
      0,
      0,
      0,
      {
        entryType: "manual",
        mealTime: mealType
      }
    );
    handleAddEntry(mealType);
  };

  const handleDeleteEntryWithLogging = async (id: string) => {
    const entryToDelete = entries.find(entry => entry.id === id);
    await logAiInteraction(
      "food_entry_delete",
      {
        entry: entryToDelete
      },
      "Food entry deleted successfully",
      "gpt-3.5-turbo",
      0,
      0,
      0,
      {
        entryType: "manual",
        deletedEntryId: id
      }
    );
    handleDeleteEntry(id);
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock8 className="w-5 h-5 text-blue-500" />
          <div>
            <CardTitle className="text-xl text-gray-900">{greeting}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{mealSuggestion}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <FoodEntryForm
          newFood={newFood}
          calories={calories}
          proteins={proteins}
          weight={weight}
          baseCalories={baseCalories}
          selectedCategory={selectedCategory}
          onFoodChange={setNewFood}
          onCaloriesChange={setCalories}
          onProteinsChange={setProteins}
          onWeightChange={setWeight}
          onAddEntry={handleAddEntryWithLogging}
        />
        
        <FoodSearch
          entries={entries}
          onDeleteEntry={handleDeleteEntryWithLogging}
        />

        <BarcodeScanner onScan={handleBarcodeScan} />
      </CardContent>
    </Card>
  );
};