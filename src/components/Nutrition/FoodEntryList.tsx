import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodEntry } from "@/types/food";

interface FoodEntryListProps {
  entries: FoodEntry[];
  onDeleteEntry: (id: string) => void;
}

export const FoodEntryList = ({ entries, onDeleteEntry }: FoodEntryListProps) => {
  return (
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
            onClick={() => onDeleteEntry(entry.id)}
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
  );
};