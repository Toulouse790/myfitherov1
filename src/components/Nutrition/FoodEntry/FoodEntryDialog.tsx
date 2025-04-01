
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsList, TabsTrigger, Tabs, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FoodEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (mealType: string) => void;
  initialValues?: {
    name?: string;
    calories?: number;
    proteins?: number;
    carbs?: number;
    fats?: number;
  };
}

export const FoodEntryDialog = ({ open, onOpenChange, onSubmit, initialValues }: FoodEntryDialogProps) => {
  const [name, setName] = useState(initialValues?.name || "");
  const [calories, setCalories] = useState(initialValues?.calories || 0);
  const [proteins, setProteins] = useState(initialValues?.proteins || 0);
  const [carbs, setCarbs] = useState(initialValues?.carbs || 0);
  const [fats, setFats] = useState(initialValues?.fats || 0);
  const [mealType, setMealType] = useState("breakfast");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(mealType);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un aliment</DialogTitle>
          <DialogDescription>
            Entrez les détails de l'aliment que vous avez consommé
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="food-name" className="text-right">
                Nom
              </Label>
              <Input
                id="food-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                placeholder="Pomme, Poulet grillé, etc."
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories" className="text-right">
                Calories
              </Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="proteins" className="text-right">
                Protéines (g)
              </Label>
              <Input
                id="proteins"
                type="number"
                value={proteins}
                onChange={(e) => setProteins(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carbs" className="text-right">
                Glucides (g)
              </Label>
              <Input
                id="carbs"
                type="number"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fats" className="text-right">
                Lipides (g)
              </Label>
              <Input
                id="fats"
                type="number"
                value={fats}
                onChange={(e) => setFats(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="meal-type" className="text-right">
                Repas
              </Label>
              <Select 
                value={mealType} 
                onValueChange={setMealType}
              >
                <SelectTrigger id="meal-type" className="col-span-3">
                  <SelectValue placeholder="Sélectionnez le type de repas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Petit-déjeuner</SelectItem>
                  <SelectItem value="lunch">Déjeuner</SelectItem>
                  <SelectItem value="dinner">Dîner</SelectItem>
                  <SelectItem value="snack">Collation</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Ajouter</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
