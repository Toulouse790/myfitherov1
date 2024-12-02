import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkoutFormData, muscleGroups, difficultyLevels } from "./workoutConstants";

interface WorkoutFormProps {
  formData: WorkoutFormData;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (value: string, field: keyof WorkoutFormData) => void;
  selectedColor: string;
}

export const WorkoutForm = ({
  formData,
  onSubmit,
  handleChange,
  handleSelectChange,
  selectedColor,
}: WorkoutFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
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
  );
};