
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface MuscleGroupGridProps {
  onSelect: (group: string) => void;
  selectedGroup: string | null;
}

export const MuscleGroupGrid = ({ onSelect, selectedGroup }: MuscleGroupGridProps) => {
  const { t, getNestedTranslation } = useLanguage();
  const muscleGroups = getNestedTranslation("muscleGroups");
  
  const groups = [
    { id: "chest", name: muscleGroups.chest || "Poitrine" },
    { id: "back", name: muscleGroups.back || "Dos" },
    { id: "shoulders", name: muscleGroups.shoulders || "Épaules" },
    { id: "arms", name: muscleGroups.arms || "Bras" },
    { id: "legs", name: muscleGroups.legs || "Jambes" },
    { id: "abs", name: muscleGroups.abs || "Abdominaux" },
    { id: "fullBody", name: muscleGroups.fullBody || "Corps entier" },
    { id: "cardio", name: muscleGroups.cardio || "Cardio" }
  ];
  
  return (
    <div className="flex flex-wrap gap-2">
      {groups.map((group) => (
        <Badge
          key={group.id}
          variant={selectedGroup === group.id ? "default" : "outline"}
          className="px-3 py-1 cursor-pointer transition-all hover:bg-primary hover:text-primary-foreground"
          onClick={() => onSelect(group.id)}
        >
          {group.name}
        </Badge>
      ))}
    </div>
  );
};
