import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface RecipeListProps {
  onCreateNew: () => void;
}

export const RecipeList = ({ onCreateNew }: RecipeListProps) => {
  const { data: recipes = [], isLoading } = useQuery({
    queryKey: ['custom-recipes'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('custom_recipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-4">
          <div className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
          <div className="h-20 bg-gray-100 animate-pulse rounded-lg"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Mes recettes</h2>
        <Button onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle recette
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium">{recipe.name}</h3>
              {recipe.description && (
                <p className="text-sm text-gray-600 mt-1">{recipe.description}</p>
              )}
              <div className="mt-2 text-sm text-gray-500">
                {recipe.ingredients.length} ingrédients • {recipe.instructions.length} étapes
              </div>
            </Card>
          ))}

          {recipes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>Vous n'avez pas encore de recettes</p>
              <p className="text-sm">Commencez par en créer une !</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};