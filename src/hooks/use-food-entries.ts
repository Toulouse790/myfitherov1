import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FoodEntry } from "@/types/food";
import { useState } from "react";

export const useFoodEntries = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);

  useQuery({
    queryKey: ['food-journal-today'],
    queryFn: async () => {
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

      const mappedEntries: FoodEntry[] = (data || []).map(entry => ({
        id: entry.id,
        name: entry.name,
        calories: entry.calories,
        proteins: entry.proteins,
        mealType: entry.meal_type
      }));

      setEntries(mappedEntries);
      return mappedEntries;
    }
  });

  const entriesByMealType = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  return {
    entries,
    entriesByMealType
  };
};