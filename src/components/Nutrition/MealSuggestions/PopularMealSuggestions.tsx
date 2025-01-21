import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MealSuggestionCard } from "./MealSuggestionCard";

export const PopularMealSuggestions = () => {
  const { data: suggestions, isLoading } = useQuery({
    queryKey: ['popular-meal-suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('popular_meal_suggestions')
        .select('*')
        .limit(4);

      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[400px] bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Suggestions populaires</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {suggestions?.map((suggestion) => (
          <MealSuggestionCard
            key={suggestion.id}
            name={suggestion.name}
            calories={suggestion.calories}
            proteins={suggestion.proteins}
            cookingTime={suggestion.cooking_time_minutes}
            difficulty={suggestion.difficulty_level}
            servings={suggestion.servings}
            rating={suggestion.rating}
            tags={suggestion.tags}
            imageUrl={suggestion.image_url}
          />
        ))}
      </div>
    </div>
  );
};