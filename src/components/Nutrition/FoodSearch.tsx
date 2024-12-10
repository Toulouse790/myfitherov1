import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

interface FoodSearchProps {
  entries: Array<{
    id: string;
    name: string;
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
    mealType: string;
  }>;
  onDeleteEntry?: (id: string) => void;
}

export const FoodSearch = ({ entries, onDeleteEntry }: FoodSearchProps) => {
  const [openMeal, setOpenMeal] = useState<string | null>(null);

  const mealTypes = {
    breakfast: "Petit déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    snack: "Collation"
  };

  const entriesByMealType = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<string, typeof entries>);

  return (
    <Card className="p-4 bg-white border border-gray-200">
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {Object.entries(mealTypes).map(([type, label]) => (
            <Collapsible
              key={type}
              open={openMeal === type}
              onOpenChange={() => setOpenMeal(openMeal === type ? null : type)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto text-gray-900 hover:bg-gray-50"
                >
                  <span className="font-medium">{label}</span>
                  <ChevronRight 
                    className={`h-4 w-4 transition-transform ${
                      openMeal === type ? "rotate-90" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="space-y-2 p-2">
                  {entriesByMealType[type]?.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                    >
                      <div className="space-y-1">
                        <p className="font-medium text-gray-900">{entry.name}</p>
                        <div className="text-sm text-gray-700 flex flex-wrap gap-2">
                          <span>{entry.calories} kcal</span>
                          <span>•</span>
                          <span>{entry.proteins}g protéines</span>
                          <span>•</span>
                          <span>{entry.carbs}g glucides</span>
                          <span>•</span>
                          <span>{entry.fats}g lipides</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!entriesByMealType[type] || entriesByMealType[type].length === 0) && (
                    <p className="text-center text-gray-700 py-4">
                      Aucun aliment enregistré pour ce repas
                    </p>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};