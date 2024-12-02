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

const difficultyLevels = [
  { id: "beginner", name: "Débutant" },
  { id: "intermediate", name: "Intermédiaire" },
  { id: "advanced", name: "Avancé" },
  { id: "expert", name: "Expert" },
];

interface WorkoutFormData {
  title: string;
  description: string;
  muscleGroup: string;
  duration: string;
  exercises: string;
  difficulty: string;
  equipment: string;
}

const initialFormData: WorkoutFormData = {
  title: "",
  description: "",
  muscleGroup: "",
  duration: "",
  exercises: "",
  difficulty: "",
  equipment: "",
};

export const CreateWorkoutDialog = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<WorkoutFormData>(initialFormData);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string, field: keyof WorkoutFormData) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast({
      title: "Séance créée",
      description: "Votre nouvelle séance a été créée avec succès.",
    });
    setOpen(false);
    setFormData(initialFormData);
  };

  const selectedColor = muscleGroups.find(group => group.id === formData.muscleGroup)?.color || "";

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
            <Input 
              id="title" 
              placeholder="Ex: Full Body" 
              required 
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Décrivez votre séance..."
              value={formData.description}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="muscleGroup">Groupe musculaire</Label>
            <Select
              value={formData.muscleGroup}
              onValueChange={(value) => handleSelectChange(value, "muscleGroup")}
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
          <div className="space-y-2">
            <Label htmlFor="difficulty">Niveau de difficulté</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleSelectChange(value, "difficulty")}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un niveau" />
              </SelectTrigger>
              <SelectContent>
                {difficultyLevels.map((level) => (
                  <SelectItem 
                    key={level.id} 
                    value={level.id}
                  >
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="equipment">Équipement nécessaire</Label>
            <Input
              id="equipment"
              placeholder="Ex: Haltères, Tapis, Barre de traction"
              value={formData.equipment}
              onChange={handleChange}
            />
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
                value={formData.duration}
                onChange={handleChange}
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
                value={formData.exercises}
                onChange={handleChange}
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