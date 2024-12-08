import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FoodEntry {
  id: string;
  name: string;
  calories: number;
  proteins: number;
  meal_type: string;
}

export const DailyMeals = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodayEntries = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('food_journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching entries:', error);
        return;
      }

      setEntries(data || []);
    };

    fetchTodayEntries();
  }, []);

  const mealTypes = {
    breakfast: "Petit déjeuner",
    lunch: "Déjeuner",
    dinner: "Dîner",
    snack: "Collation"
  };

  const entriesByMealType = entries.reduce((acc, entry) => {
    if (!acc[entry.meal_type]) {
      acc[entry.meal_type] = [];
    }
    acc[entry.meal_type].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  const calculateMealTotals = (mealEntries: FoodEntry[]) => {
    return mealEntries.reduce(
      (totals, entry) => ({
        calories: totals.calories + entry.calories,
        proteins: totals.proteins + entry.proteins,
      }),
      { calories: 0, proteins: 0 }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Repas du jour</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <ScrollArea className="h-[400px] pr-4">
          {Object.entries(mealTypes).map(([type, label]) => {
            const mealEntries = entriesByMealType[type] || [];
            const totals = calculateMealTotals(mealEntries);

            return (
              <div key={type} className="mb-2">
                <Button
                  variant="ghost"
                  className="w-full justify-between p-4 h-auto"
                  onClick={() => setExpandedMeal(expandedMeal === type ? null : type)}
                >
                  <div className="text-left">
                    <div className="font-medium">{label}</div>
                    {mealEntries.length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {totals.calories} kcal • {totals.proteins}g protéines
                      </div>
                    )}
                  </div>
                  {expandedMeal === type ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {expandedMeal === type && (
                  <div className="pl-4 pr-2 py-2 space-y-2">
                    {mealEntries.length > 0 ? (
                      mealEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="p-3 rounded-lg bg-muted/50"
                        >
                          <div className="font-medium">{entry.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.calories} kcal • {entry.proteins}g protéines
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-2">
                        Aucun aliment enregistré
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};