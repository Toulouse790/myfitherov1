import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { commonFoods } from "@/data/commonFoods";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  proteins: number;
}

export const FoodJournal = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [newFood, setNewFood] = useState("");
  const [calories, setCalories] = useState("");
  const [proteins, setProteins] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { toast } = useToast();

  const handleAddEntry = () => {
    if (!newFood || !calories || !proteins) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    const newEntry: FoodEntry = {
      id: Date.now().toString(),
      name: newFood,
      calories: Number(calories),
      proteins: Number(proteins),
    };

    setEntries([...entries, newEntry]);
    setNewFood("");
    setCalories("");
    setProteins("");

    toast({
      title: "Aliment ajouté",
      description: "L'aliment a été ajouté à votre journal",
    });
  };

  const handleSelectFood = (foodId: string) => {
    const selectedFood = commonFoods.find((food) => food.id === foodId);
    if (selectedFood) {
      setNewFood(selectedFood.name);
      setCalories(selectedFood.calories.toString());
      setProteins(selectedFood.proteins.toString());
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast({
      title: "Aliment supprimé",
      description: "L'aliment a été supprimé de votre journal",
    });
  };

  const filteredFoods = selectedCategory
    ? commonFoods.filter((food) => food.category === selectedCategory)
    : commonFoods;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal alimentaire</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
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
                onClick={() => handleSelectFood(food.id)}
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

          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Aliment"
              value={newFood}
              onChange={(e) => setNewFood(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Calories"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="w-24"
            />
            <Input
              type="number"
              placeholder="Protéines (g)"
              value={proteins}
              onChange={(e) => setProteins(e.target.value)}
              className="w-24"
            />
            <Button onClick={handleAddEntry} className="gap-2">
              <Plus className="w-4 h-4" /> Ajouter
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-2 rounded bg-muted/50"
            >
              <div>
                <p className="font-medium">{entry.name}</p>
                <p className="text-sm text-muted-foreground">
                  {entry.calories} kcal | {entry.proteins}g protéines
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteEntry(entry.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {entries.length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              Aucun aliment dans le journal
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};