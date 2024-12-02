import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FoodSearch } from "./FoodSearch";
import { FoodEntryForm } from "./FoodEntryForm";
import { FoodEntryList } from "./FoodEntryList";
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
  } = useFoodJournal();

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