import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodEntry } from "@/types/food";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FoodEntryListProps {
  entries: FoodEntry[];
  onDeleteEntry: (id: string) => void;
}

export const FoodEntryList = ({ entries, onDeleteEntry }: FoodEntryListProps) => {
  return (
    <Card className="p-4 bg-white border border-gray-200">
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="space-y-1">
                <p className="font-medium text-gray-800">{entry.name}</p>
                <div className="flex gap-3 text-sm text-gray-600">
                  <span>{entry.calories} kcal</span>
                  <span>•</span>
                  <span>{entry.proteins}g protéines</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteEntry(entry.id)}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <p>Aucun aliment dans le journal</p>
              <p className="text-sm">Commencez par ajouter un aliment ci-dessus</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};