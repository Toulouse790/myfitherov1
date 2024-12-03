import { useState } from "react";
import { Input } from "@/components/ui/input";
import { commonFoods } from "@/data/commonFoods";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface FoodInputsProps {
  newFood: string;
  weight: string;
  calories: string;
  proteins: string;
  isCustomFood: boolean;
  onFoodChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onCaloriesChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  setIsCustomFood: (value: boolean) => void;
}

export const FoodInputs = ({
  newFood,
  weight,
  calories,
  proteins,
  isCustomFood,
  onFoodChange,
  onWeightChange,
  onCaloriesChange,
  onProteinsChange,
  setIsCustomFood,
}: FoodInputsProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const handleSelectFood = (food: typeof commonFoods[0]) => {
    onFoodChange(food.name);
    setIsCustomFood(false);
    setOpen(false);

    if (weight) {
      const weightNum = parseFloat(weight);
      if (!isNaN(weightNum)) {
        const newCalories = Math.round((food.calories * weightNum) / 100);
        const newProteins = Math.round((food.proteins * weightNum) / 100);
        onCaloriesChange(newCalories.toString());
        onProteinsChange(newProteins.toString());
      }
    }
  };

  const handleWeightChange = (newWeight: string) => {
    onWeightChange(newWeight);
    
    const selectedFood = commonFoods.find(f => f.name === newFood);
    if (selectedFood && newWeight) {
      const weightNum = parseFloat(newWeight);
      if (!isNaN(weightNum)) {
        const newCalories = Math.round((selectedFood.calories * weightNum) / 100);
        const newProteins = Math.round((selectedFood.proteins * weightNum) / 100);
        onCaloriesChange(newCalories.toString());
        onProteinsChange(newProteins.toString());
      }
    }
  };

  const filteredFoods = commonFoods.filter(food => 
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="space-y-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start text-left font-normal"
            >
              {newFood || "Sélectionner un aliment..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput 
                placeholder="Rechercher un aliment..." 
                value={search}
                onValueChange={setSearch}
              />
              <CommandEmpty>Aucun aliment trouvé.</CommandEmpty>
              <CommandGroup>
                {filteredFoods.map((food) => (
                  <CommandItem
                    key={food.id}
                    value={food.name}
                    onSelect={() => handleSelectFood(food)}
                  >
                    {food.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        <Input
          type="number"
          placeholder="Quantité (g)"
          value={weight}
          onChange={(e) => handleWeightChange(e.target.value)}
          className="bg-white"
        />
      </div>

      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => onCaloriesChange(e.target.value)}
          className={isCustomFood ? "bg-white" : "bg-gray-50"}
          readOnly={!isCustomFood}
        />
        <Input
          type="number"
          placeholder="Protéines (g)"
          value={proteins}
          onChange={(e) => onProteinsChange(e.target.value)}
          className={isCustomFood ? "bg-white" : "bg-gray-50"}
          readOnly={!isCustomFood}
        />
      </div>
    </div>
  );
};