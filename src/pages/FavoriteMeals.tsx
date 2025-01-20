import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface FavoriteMeal {
  id: string;
  name: string;
  meal_type: string;
  food_entries: {
    calories: number;
    proteins: number;
    carbs: number;
    fats: number;
  }[];
}

export default function FavoriteMeals() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: favorites, refetch } = useQuery({
    queryKey: ['favorite-meals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('favorite_meals')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;
      return data as FavoriteMeal[];
    },
    enabled: !!user
  });

  const handleRemoveFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorite_meals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Favori supprimé",
        description: "Le repas a été retiré de vos favoris"
      });

      refetch();
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le favori",
        variant: "destructive"
      });
    }
  };

  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mes Repas Favoris</h1>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Tous</TabsTrigger>
          {mealTypes.map((type) => (
            <TabsTrigger key={type} value={type}>
              {type === 'breakfast' && 'Petit-déjeuner'}
              {type === 'lunch' && 'Déjeuner'}
              {type === 'dinner' && 'Dîner'}
              {type === 'snack' && 'Collation'}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <ScrollArea className="h-[600px]">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {favorites?.map((meal) => (
                <FavoriteMealCard 
                  key={meal.id} 
                  meal={meal} 
                  onRemove={handleRemoveFavorite} 
                />
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        {mealTypes.map((type) => (
          <TabsContent key={type} value={type}>
            <ScrollArea className="h-[600px]">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favorites
                  ?.filter((meal) => meal.meal_type === type)
                  .map((meal) => (
                    <FavoriteMealCard 
                      key={meal.id} 
                      meal={meal} 
                      onRemove={handleRemoveFavorite} 
                    />
                  ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function FavoriteMealCard({ 
  meal, 
  onRemove 
}: { 
  meal: FavoriteMeal; 
  onRemove: (id: string) => void;
}) {
  const totalNutrients = meal.food_entries?.reduce(
    (acc, entry) => ({
      calories: acc.calories + entry.calories,
      proteins: acc.proteins + entry.proteins,
      carbs: acc.carbs + entry.carbs,
      fats: acc.fats + entry.fats,
    }),
    { calories: 0, proteins: 0, carbs: 0, fats: 0 }
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{meal.name}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(meal.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Badge variant="secondary">
            {meal.meal_type === 'breakfast' && 'Petit-déjeuner'}
            {meal.meal_type === 'lunch' && 'Déjeuner'}
            {meal.meal_type === 'dinner' && 'Dîner'}
            {meal.meal_type === 'snack' && 'Collation'}
          </Badge>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Calories: {totalNutrients.calories}</div>
            <div>Protéines: {totalNutrients.proteins}g</div>
            <div>Glucides: {totalNutrients.carbs}g</div>
            <div>Lipides: {totalNutrients.fats}g</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}