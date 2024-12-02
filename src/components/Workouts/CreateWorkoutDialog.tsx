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
import { Textarea } from "@/components/ui/textarea";

const muscleGroups = [
  { id: "chest", name: "Pectoraux", color: "bg-primary" },
  { id: "back", name: "Dos", color: "bg-primary" },
  { id: "legs", name: "Jambes", color: "bg-primary" },
  { id: "shoulders", name: "Épaules", color: "bg-primary" },
  { id: "arms", name: "Bras", color: "bg-primary" },
  { id: "abs", name: "Abdominaux", color: "bg-primary" },
  { id: "fullBody", name: "Full Body", color: "bg-primary" },
];

export const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [muscleGroup, setMuscleGroup] = useState("");
  const [description, setDescription] = useState("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Séance créée",
      description: "Votre nouvelle séance a été créée avec succès.",
    });
    setOpen(false);
    setDescription("");
    setMuscleGroup("");
  };

  const selectedColor = muscleGroups.find(group => group.id === muscleGroup)?.color || "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Nouvelle séance
        </Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] ${selectedColor} transition-colors duration-200`}>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle séance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nom de la séance</Label>
            <Input id="title" placeholder="Ex: Full Body" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Décrivez votre séance..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px]"
            />
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
                  <SelectItem 
                    key={group.id} 
                    value={group.id}
                    className={`${group.color} text-white`}
                  >
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Durée (min)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                placeholder="Ex: 45"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exercises">Exercices</Label>
              <Input
                id="exercises"
                type="number"
                min="1"
                placeholder="Ex: 8"
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full">
            Créer la séance
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};