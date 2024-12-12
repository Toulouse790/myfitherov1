import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { commonFoods } from "@/data/commonFoods";

interface Ingredient {
  name: string;
  portion: string;
}

interface MultipleIngredientsProps {
  ingredients: Ingredient[];
  onIngredientsChange: (ingredients: Ingredient[]) => void;
}

export const MultipleIngredients = ({
  ingredients,
  onIngredientsChange,
}: MultipleIngredientsProps) => {
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    portion: "100",
  });

  const handleAddIngredient = () => {
    if (newIngredient.name && newIngredient.portion) {
      onIngredientsChange([...ingredients, newIngredient]);
      setNewIngredient({ name: "", portion: "100" });
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    onIngredientsChange(updatedIngredients);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                value={ingredient.name}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <div className="w-24">
              <Input
                value={`${ingredient.portion}g`}
                readOnly
                className="bg-gray-50"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveIngredient(index)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            placeholder="Nom de l'aliment"
            value={newIngredient.name}
            onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
            list="ingredients-suggestions"
          />
          <datalist id="ingredients-suggestions">
            {commonFoods.map((food) => (
              <option key={food.id} value={food.name} />
            ))}
          </datalist>
        </div>
        <div className="w-24">
          <Input
            type="number"
            placeholder="Portion (g)"
            value={newIngredient.portion}
            onChange={(e) => setNewIngredient({ ...newIngredient, portion: e.target.value })}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleAddIngredient}
          className="text-green-500 hover:text-green-600 hover:bg-green-50"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};