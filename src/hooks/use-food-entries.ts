import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FoodEntry } from "@/types/food";
import { useState } from "react";

export const useFoodEntries = () => {
  const [entries, setEntries] = useState<FoodEntry[]>([]);

  const { refetch } = useQuery({
    queryKey: ['food-journal-today'],
    queryFn: async () => {
      console.log("Fetching food entries...");
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("No user found, skipping fetch");
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      console.log("Fetching entries for date:", today.toISOString());

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

      console.log("Fetched entries:", data);

      const mappedEntries: FoodEntry[] = (data || []).map(entry => ({
        id: entry.id,
        name: entry.name,
        calories: entry.calories,
        proteins: entry.proteins,
        mealType: entry.meal_type
      }));

      console.log("Mapped entries:", mappedEntries);
      setEntries(mappedEntries);
      return mappedEntries;
    },
    refetchOnWindowFocus: true,
    staleTime: 0, // Force refetch every time
    cacheTime: 0  // Don't cache the data
  });

  const entriesByMealType = entries.reduce((acc, entry) => {
    if (!acc[entry.mealType]) {
      acc[entry.mealType] = [];
    }
    acc[entry.mealType].push(entry);
    return acc;
  }, {} as Record<string, FoodEntry[]>);

  console.log("Entries by meal type:", entriesByMealType);

  return {
    entries,
    entriesByMealType,
    refetchEntries: refetch
  };
};