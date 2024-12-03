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
  } = useFoodJournal();

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-xl text-gray-800">Journal alimentaire</CardTitle>
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
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          filteredFoods={filteredFoods}
          onSelectFood={handleSelectFood}
          userAllergies={userAllergies}
        />

        <FoodEntryList
          entries={entries}
          onDeleteEntry={handleDeleteEntry}
        />
      </CardContent>
    </Card>
  );
};