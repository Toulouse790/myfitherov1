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

interface FoodSearchProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filteredFoods: CommonFood[];
  onSelectFood: (foodId: string) => void;
}

export const FoodSearch = ({
  selectedCategory,
  onCategoryChange,
  filteredFoods,
  onSelectFood,
}: FoodSearchProps) => {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-muted/50 p-2 rounded">
        {filteredFoods.map((food) => (
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
      </div>
    </div>
  );
};