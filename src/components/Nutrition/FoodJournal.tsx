import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FoodSearch } from "./FoodSearch";
import { FoodEntryForm } from "./FoodEntryForm";
import { BarcodeScanner } from "./BarcodeScanner";
import { useFoodJournal } from "@/hooks/use-food-journal";

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

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-gray-900">Journal alimentaire</CardTitle>
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
          onAddEntry={handleAddEntry}
        />
        
        <BarcodeScanner onScan={handleBarcodeScan} />
        
        <FoodSearch
          entries={entries}
          onDeleteEntry={handleDeleteEntry}
        />
      </CardContent>
    </Card>
  );
};