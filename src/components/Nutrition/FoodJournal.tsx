
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FoodEntryForm } from "./FoodEntryForm";
import { FoodEntryList } from "./FoodEntryList";
import { useToast } from "@/hooks/use-toast";
import { useFoodJournal } from "@/hooks/use-food-journal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { FoodSuggestions } from "./FoodSuggestions";
import { FoodEntry } from "@/types/food";

export const FoodJournal = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
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
    entries
  } = useFoodJournal();

  const [filteredEntries, setFilteredEntries] = useState(entries);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredEntries(entries);
    } else {
      setFilteredEntries(entries.filter(entry => entry.mealType === activeTab));
    }
  }, [entries, activeTab]);

  const getTotalNutrients = () => {
    return filteredEntries.reduce((acc, entry) => ({
      calories: acc.calories + entry.calories,
      proteins: acc.proteins + entry.proteins,
      carbs: acc.carbs + (entry.carbs || 0),
      fats: acc.fats + (entry.fats || 0),
    }), {
      calories: 0,
      proteins: 0,
      carbs: 0,
      fats: 0,
    });
  };

  const totals = getTotalNutrients();

  const handleAddEntryWithLogging = async (mealType: string) => {
    try {
      await handleAddEntry(mealType);
      toast({
        title: "Succès",
        description: "L'aliment a été ajouté à votre journal",
      });
    } catch (error) {
      console.error('Error adding food entry:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'aliment",
        variant: "destructive",
      });
    }
  };

  const handleSelectSuggestion = (food: FoodEntry) => {
    setNewFood(food.name);
    setCalories(food.calories);
    setProteins(food.proteins);
    if (food.carbs) setCarbs(food.carbs);
    if (food.fats) setFats(food.fats);
    if (food.description) setNotes(food.description);
    if (food.mealType) {
      handleAddEntryWithLogging(food.mealType);
    } else {
      toast({
        title: "Information",
        description: "Veuillez sélectionner un type de repas pour cette suggestion",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Journal alimentaire</span>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-normal">
              {totals.calories} kcal
            </Badge>
            <Badge variant="outline" className="font-normal">
              {totals.proteins}g protéines
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <FoodEntryForm
          newFood={newFood}
          calories={calories}
          proteins={proteins}
          carbs={carbs}
          fats={fats}
          weight={weight}
          notes={notes}
          baseCalories={baseCalories}
          selectedCategory={selectedCategory}
          onFoodChange={setNewFood}
          onCaloriesChange={setCalories}
          onProteinsChange={setProteins}
          onCarbsChange={setCarbs}
          onFatsChange={setFats}
          onWeightChange={setWeight}
          onNotesChange={setNotes}
          onAddEntry={handleAddEntryWithLogging}
        />
        
        <FoodSuggestions onSelectFood={handleSelectSuggestion} />
        
        <div className="mt-8 space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 mb-4">
              <TabsTrigger value="all">Tous</TabsTrigger>
              <TabsTrigger value="breakfast">Petit déj</TabsTrigger>
              <TabsTrigger value="morning_snack">Collation</TabsTrigger>
              <TabsTrigger value="lunch">Déjeuner</TabsTrigger>
              <TabsTrigger value="afternoon_snack">Goûter</TabsTrigger>
              <TabsTrigger value="dinner">Dîner</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              <FoodEntryList 
                entries={filteredEntries}
                onDelete={handleDeleteEntry}
              />
            </TabsContent>
            
            {["breakfast", "morning_snack", "lunch", "afternoon_snack", "dinner"].map((mealType) => (
              <TabsContent key={mealType} value={mealType}>
                <FoodEntryList 
                  entries={filteredEntries}
                  onDelete={handleDeleteEntry}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};
