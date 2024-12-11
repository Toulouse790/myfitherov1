import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DifficultySelectProps {
  difficulty: string;
  onDifficultyChange: (value: string) => void;
}

export const DifficultySelect = ({
  difficulty,
  onDifficultyChange,
}: DifficultySelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Difficulté perçue</label>
      <Select value={difficulty} onValueChange={onDifficultyChange}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir la difficulté" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">Facile</SelectItem>
          <SelectItem value="moderate">Modérée</SelectItem>
          <SelectItem value="hard">Difficile</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};