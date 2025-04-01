
import { supabase } from "@/integrations/supabase/client";
import { FoodEntry } from "@/types/food";

export const loadFoodEntries = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Vous devez être connecté pour voir votre journal");
  }
  
  const { data, error } = await supabase
    .from('food_journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data as FoodEntry[];
};

export const addFoodEntry = async (entry: Omit<FoodEntry, 'id' | 'user_id'>) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("Vous devez être connecté pour ajouter un aliment");
  }

  const { data, error } = await supabase
    .from('food_journal_entries')
    .insert({
      user_id: user.id,
      name: entry.name,
      calories: parseInt(entry.calories.toString()),
      proteins: parseInt(entry.proteins.toString()),
      carbs: parseInt(entry.carbs?.toString() || '0'),
      fats: parseInt(entry.fats?.toString() || '0'),
      meal_type: entry.mealType || 'snack',
      notes: entry.notes
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  return data;
};

export const deleteFoodEntry = async (id: string) => {
  const { error } = await supabase
    .from('food_journal_entries')
    .delete()
    .eq('id', id);

  if (error) {
    throw error;
  }
};

export const checkDuplicateEntry = async (name: string, mealType: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Vérifier si une entrée avec le même nom et type de repas existe déjà aujourd'hui
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString();
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)).toISOString();

    const { data, error } = await supabase
      .from('food_journal_entries')
      .select('id, name')
      .eq('user_id', user.id)
      .eq('name', name)
      .eq('meal_type', mealType)
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay);

    if (error) {
      console.error("Erreur lors de la vérification des doublons:", error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error("Erreur lors de la vérification des doublons:", error);
    return false;
  }
};
