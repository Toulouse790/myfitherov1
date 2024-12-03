import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommonFood } from "@/types/food";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FoodSearchProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filteredFoods: CommonFood[];
  onSelectFood: (foodId: string) => void;
  userAllergies?: string[];
}

export const FoodSearch = ({
  selectedCategory,
  onCategoryChange,
  filteredFoods,
  onSelectFood,
  userAllergies = [],
}: FoodSearchProps) => {
  const displayedFoods = filteredFoods.filter(
    (food) => !userAllergies.some((allergy) => 
      food.name.toLowerCase().includes(allergy.toLowerCase())
    )
  );

  const categories = [
    { value: "all", label: "Tout" },
    { value: "Protéines", label: "Protéines" },
    { value: "Féculents", label: "Féculents" },
    { value: "Légumes", label: "Légumes" },
    { value: "Fruits", label: "Fruits" },
    { value: "Produits laitiers", label: "Laitages" },
    { value: "Autres", label: "Autres" }
  ];

  return (
    <div className="space-y-4">
      <Tabs defaultValue={selectedCategory} onValueChange={onCategoryChange}>
        <TabsList className="w-full flex-wrap h-auto bg-white border border-gray-200">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.value} 
              value={category.value}
              className="text-gray-700 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category.value} value={category.value}>
            <ScrollArea className="h-[300px] rounded-md border border-gray-200">
              <div className="grid grid-cols-1 gap-2 p-2">
                {displayedFoods
                  .filter(food => category.value === "all" || food.category === category.value)
                  .map((food) => (
                    <Button
                      key={food.id}
                      variant="ghost"
                      className="w-full justify-start h-auto py-3 px-4 bg-white hover:bg-gray-50 text-gray-800"
                      onClick={() => onSelectFood(food.id)}
                    >
                      <div className="text-left space-y-1">
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-gray-600 flex gap-3">
                          <span>{food.calories} kcal</span>
                          <span>•</span>
                          <span>{food.proteins}g protéines</span>
                        </div>
                      </div>
                    </Button>
                  ))}
                {displayedFoods.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    Aucun aliment disponible dans cette catégorie
                  </p>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};