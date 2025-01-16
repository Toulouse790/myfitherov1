import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MealTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const MealTypeSelect = ({ value, onChange }: MealTypeSelectProps) => {
  const mealTypes = [
    { value: "breakfast", label: "Petit déjeuner" },
    { value: "morning_snack", label: "Collation (matin)" },
    { value: "lunch", label: "Déjeuner" },
    { value: "afternoon_snack", label: "Collation (après-midi)" },
    { value: "dinner", label: "Dîner" }
  ];

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full md:w-[200px] bg-white text-black">
        <SelectValue placeholder="Sélectionner un repas" />
      </SelectTrigger>
      <SelectContent>
        {mealTypes.map((type) => (
          <SelectItem 
            key={type.value} 
            value={type.value}
            className="text-black hover:bg-blue-50"
          >
            {type.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};