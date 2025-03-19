
import { Trash2, Clock, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodEntry } from "@/types/food";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export interface FoodEntryListProps {
  entries: FoodEntry[];
  onDelete: (id: string) => Promise<void>;
}

export const FoodEntryList = ({ entries, onDelete }: FoodEntryListProps) => {
  const groupEntriesByDate = () => {
    const grouped: Record<string, FoodEntry[]> = {};
    
    entries.forEach(entry => {
      let dateStr = "Aujourd'hui";
      if (entry.created_at) {
        const entryDate = new Date(entry.created_at);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (entryDate.toDateString() === today.toDateString()) {
          dateStr = "Aujourd'hui";
        } else if (entryDate.toDateString() === yesterday.toDateString()) {
          dateStr = "Hier";
        } else {
          dateStr = format(entryDate, 'EEEE d MMMM', { locale: fr });
        }
      }
      
      if (!grouped[dateStr]) {
        grouped[dateStr] = [];
      }
      grouped[dateStr].push(entry);
    });
    
    return grouped;
  };

  const getMealTypeLabel = (mealType: string | undefined) => {
    const labels: Record<string, string> = {
      breakfast: "Petit déjeuner",
      morning_snack: "Collation matin",
      lunch: "Déjeuner",
      afternoon_snack: "Collation après-midi",
      dinner: "Dîner"
    };
    return mealType ? labels[mealType] || mealType : "Repas";
  };

  const groupedEntries = groupEntriesByDate();

  return (
    <Card className="p-4 bg-white border border-gray-200">
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {Object.entries(groupedEntries).map(([date, dateEntries]) => (
            <div key={date} className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground first-letter:uppercase">{date}</h3>
              
              <div className="space-y-2">
                {dateEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800">{entry.name}</p>
                        {entry.mealType && (
                          <Badge variant="secondary" className="text-xs">
                            {getMealTypeLabel(entry.mealType)}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex flex-wrap gap-x-3 text-sm text-gray-600">
                        <span>{entry.calories} kcal</span>
                        <span>{entry.proteins}g protéines</span>
                        {entry.carbs > 0 && <span>{entry.carbs}g glucides</span>}
                        {entry.fats > 0 && <span>{entry.fats}g lipides</span>}
                      </div>
                      
                      {entry.created_at && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{format(new Date(entry.created_at), 'HH:mm')}</span>
                        </div>
                      )}
                      
                      {entry.notes && (
                        <p className="text-sm text-gray-500 mt-1 italic">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(entry.id)}
                      className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          
          {entries.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <UtensilsCrossed className="w-12 h-12 text-gray-300 mb-4" />
              <p>Aucun aliment dans le journal</p>
              <p className="text-sm">Commencez par ajouter un aliment ci-dessus</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};
