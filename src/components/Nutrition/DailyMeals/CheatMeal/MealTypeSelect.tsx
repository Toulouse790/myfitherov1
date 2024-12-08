import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MealTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const MealTypeSelect = ({ value, onChange }: MealTypeSelectProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Remplacer</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choisir le repas à remplacer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="lunch">Déjeuner</SelectItem>
          <SelectItem value="dinner">Dîner</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};