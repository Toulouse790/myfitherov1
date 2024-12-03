import { supabase } from "@/integrations/supabase/client";
import { FoodEntry } from "@/types/food";

export const loadFoodEntries = async (userId: string) => {
  const { data, error } = await supabase
    .from('food_journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const addFoodEntry = async (userId: string, entry: Omit<FoodEntry, 'id'>) => {
  const { data, error } = await supabase
    .from('food_journal_entries')
    .insert({
      user_id: userId,
      name: entry.name,
      calories: parseInt(entry.calories.toString()),
      proteins: parseInt(entry.proteins.toString()),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteFoodEntry = async (id: string) => {
  const { error } = await supabase
    .from('food_journal_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
};