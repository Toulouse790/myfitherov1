import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const muscleGroups = [
  { id: "chest", name: "Pectoraux" },
  { id: "back", name: "Dos" },
  { id: "legs", name: "Jambes" },
  { id: "shoulders", name: "Épaules" },
  { id: "arms", name: "Bras" },
  { id: "abs", name: "Abdominaux" },
  { id: "fullBody", name: "Full Body" },
];

export const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [muscleGroup, setMuscleGroup] = useState("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Séance créée",
      description: "Votre nouvelle séance a été créée avec succès.",
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle séance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Créer une nouvelle séance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nom de la séance</Label>
            <Input id="title" placeholder="Ex: Full Body" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="muscleGroup">Groupe musculaire</Label>
            <Select
              value={muscleGroup}
              onValueChange={setMuscleGroup}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un groupe musculaire" />
              </SelectTrigger>
              <SelectContent>
                {muscleGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Durée (en minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              placeholder="Ex: 45"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exercises">Nombre d'exercices</Label>
            <Input
              id="exercises"
              type="number"
              min="1"
              placeholder="Ex: 8"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Créer la séance
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};