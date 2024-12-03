import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
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
  const [searchValue, setSearchValue] = useState("");

  const handleSelectFood = (selectedFood: typeof commonFoods[0]) => {
    onFoodChange(selectedFood.name);
    onCaloriesChange(selectedFood.calories.toString());
    onProteinsChange(selectedFood.proteins.toString());
    setIsCustomFood(false);
    setOpen(false);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="space-y-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-start text-left font-normal bg-white border-gray-300 text-gray-900"
            >
              {newFood || "Sélectionner un aliment..."}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder="Rechercher un aliment..." 
                className="h-9"
                value={searchValue}
                onValueChange={setSearchValue}
              />
              <CommandEmpty>Aucun aliment trouvé.</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {commonFoods
                  .filter(food => 
                    food.name.toLowerCase().includes(searchValue.toLowerCase())
                  )
                  .map((food) => (
                    <CommandItem
                      key={food.id}
                      value={food.name}
                      onSelect={() => handleSelectFood(food)}
                    >
                      <div>
                        <div className="font-medium">{food.name}</div>
                        <div className="text-sm text-gray-500">
                          {food.calories} kcal | {food.proteins}g protéines
                        </div>
                      </div>
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
          onChange={(e) => onWeightChange(e.target.value)}
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
        />
      </div>
      <div className="space-y-2">
        <Input
          type="number"
          placeholder="Calories"
          value={calories}
          onChange={(e) => onCaloriesChange(e.target.value)}
          className={`border-gray-300 text-gray-900 placeholder:text-gray-500 ${isCustomFood ? 'bg-white' : 'bg-gray-50'}`}
          readOnly={!isCustomFood}
        />
        <Input
          type="number"
          placeholder="Protéines (g)"
          value={proteins}
          onChange={(e) => onProteinsChange(e.target.value)}
          className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
        />
      </div>
    </div>
  );
};