import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FoodEntryFormProps {
  newFood: string;
  calories: string;
  proteins: string;
  weight: string;
  baseCalories: number;
  onFoodChange: (value: string) => void;
  onCaloriesChange: (value: string) => void;
  onProteinsChange: (value: string) => void;
  onWeightChange: (value: string) => void;
  onAddEntry: () => void;
}

export const FoodEntryForm = ({
  newFood,
  calories,
  proteins,
  weight,
  baseCalories,
  onFoodChange,
  onCaloriesChange,
  onProteinsChange,
  onWeightChange,
  onAddEntry,
}: FoodEntryFormProps) => {
  const { toast } = useToast();
  const [selectedMealType, setSelectedMealType] = useState("");
  const [isCustomFood, setIsCustomFood] = useState(false);

  const handleWeightChange = (value: string) => {
    onWeightChange(value);
    if (baseCalories > 0 && value) {
      const newCalories = Math.round((baseCalories * parseInt(value)) / 100);
      onCaloriesChange(newCalories.toString());
    }
  };

  const handleSuggestFood = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour suggérer un aliment",
          variant: "destructive",
        });
        return;
      }

      if (!newFood || !calories || !proteins) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs",
          variant: "destructive",
        });
        return;
      }

      await supabase.from('user_suggested_foods').insert({
        user_id: user.id,
        name: newFood,
        calories: parseInt(calories),
        proteins: parseInt(proteins),
        category: selectedCategory || "Autres"
      });

      toast({
        title: "Suggestion envoyée",
        description: "Votre suggestion d'aliment a été enregistrée et sera examinée",
      });

      // Reset form after successful suggestion
      onFoodChange("");
      onCaloriesChange("");
      onProteinsChange("");
      onWeightChange("");
      setIsCustomFood(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la suggestion",
        variant: "destructive",
      });
    }
  };

  const mealTypes = [
    { value: "breakfast", label: "Petit déjeuner" },
    { value: "morning_snack", label: "Collation matin" },
    { value: "lunch", label: "Déjeuner" },
    { value: "afternoon_snack", label: "Collation après-midi" },
    { value: "dinner", label: "Dîner" },
  ];

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-white border border-gray-200">
        <div className="flex items-center gap-4">
          <Select value={selectedMealType} onValueChange={setSelectedMealType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sélectionner un repas" />
            </SelectTrigger>
            <SelectContent>
              {mealTypes.map((type) => (
                <SelectItem 
                  key={type.value} 
                  value={type.value}
                  className="text-gray-800 hover:bg-gray-100"
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-4 bg-white border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Input
            placeholder="Aliment"
            value={newFood}
            onChange={(e) => {
              onFoodChange(e.target.value);
              setIsCustomFood(true);
            }}
            className="col-span-2 md:col-span-1 bg-white border-gray-300"
          />
          <Input
            type="number"
            placeholder="Poids (g)"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            className="bg-white border-gray-300"
          />
          <Input
            type="number"
            placeholder="Calories"
            value={calories}
            onChange={(e) => onCaloriesChange(e.target.value)}
            className={`border-gray-300 ${isCustomFood ? 'bg-white' : 'bg-gray-50'}`}
            readOnly={!isCustomFood}
          />
          <Input
            type="number"
            placeholder="Protéines (g)"
            value={proteins}
            onChange={(e) => onProteinsChange(e.target.value)}
            className="bg-white border-gray-300"
          />
        </div>
        <div className="mt-4 flex justify-between">
          {isCustomFood && (
            <Button 
              onClick={handleSuggestFood}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" /> Suggérer cet aliment
            </Button>
          )}
          <Button 
            onClick={onAddEntry} 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </Button>
        </div>
      </Card>
    </div>
  );
};