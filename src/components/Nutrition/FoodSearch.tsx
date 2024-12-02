import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  // Filtrer les aliments en fonction des allergies
  const displayedFoods = filteredFoods.filter(
    (food) => !userAllergies.some((allergy) => 
      food.name.toLowerCase().includes(allergy.toLowerCase())
    )
  );

  const categories = [
    { value: "all", label: "Toutes les catégories" },
    { value: "Protéines", label: "Protéines" },
    { value: "Féculents", label: "Féculents" },
    { value: "Légumes", label: "Légumes" },
    { value: "Fruits", label: "Fruits" },
    { value: "Produits laitiers", label: "Produits laitiers" },
    { value: "Autres", label: "Autres" }
  ];

  return (
    <div className="space-y-4">
      <Tabs defaultValue={selectedCategory} onValueChange={onCategoryChange}>
        <TabsList className="w-full flex-wrap h-auto">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.value} 
              value={category.value}
              className="flex-1"
            >
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent key={category.value} value={category.value}>
            <ScrollArea className="h-[200px] rounded-md border p-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {displayedFoods
                  .filter(food => category.value === "all" || food.category === category.value)
                  .map((food) => (
                    <Button
                      key={food.id}
                      variant="ghost"
                      className="justify-start h-auto py-2"
                      onClick={() => onSelectFood(food.id)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {food.calories} kcal | {food.proteins}g protéines
                        </div>
                      </div>
                    </Button>
                  ))}
                {displayedFoods.length === 0 && (
                  <p className="text-center text-muted-foreground col-span-2 py-4">
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