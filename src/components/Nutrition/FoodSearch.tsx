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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Select
          value={selectedCategory}
          onValueChange={onCategoryChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="Protéines">Protéines</SelectItem>
            <SelectItem value="Féculents">Féculents</SelectItem>
            <SelectItem value="Légumes">Légumes</SelectItem>
            <SelectItem value="Fruits">Fruits</SelectItem>
            <SelectItem value="Produits laitiers">Produits laitiers</SelectItem>
            <SelectItem value="Autres">Autres</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[200px] rounded-md border p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {displayedFoods.map((food) => (
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
    </div>
  );
};