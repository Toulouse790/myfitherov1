import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    toast({
      title: "Aliment supprimé",
      description: "L'aliment a été supprimé de votre journal",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Journal alimentaire</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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