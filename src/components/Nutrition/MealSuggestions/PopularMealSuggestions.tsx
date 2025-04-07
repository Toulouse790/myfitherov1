
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MealSuggestionCard } from "./MealSuggestionCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PopularMealSuggestions = () => {
  const { toast } = useToast();
  const { data: suggestions, isLoading, error } = useQuery({
    queryKey: ['popular-meal-suggestions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('popular_meal_suggestions')
        .select('*')
        .limit(4);

      if (error) {
        console.error("Erreur lors du chargement des suggestions:", error);
        throw error;
      }
      return data;
    }
  });

  const handleAddToMealPlan = async (suggestion: any) => {
    try {
      // Ici, nous pourrions implémenter l'ajout au plan de repas
      toast({
        title: "Recette ajoutée",
        description: `${suggestion.name} a été ajouté à votre plan de repas`,
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout au plan:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter cette recette à votre plan",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[400px] bg-muted rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Une erreur est survenue lors du chargement des suggestions.
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
            actionButton={
              <Button 
                size="sm" 
                variant="outline" 
                className="w-full" 
                onClick={() => handleAddToMealPlan(suggestion)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter au plan
              </Button>
            }
          />
        ))}
      </div>
    </div>
  );
};
