import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CommonFood {
  name: string;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  food_category: string;
}

export const NutritionPreferences = () => {
  const [foods, setFoods] = useState<CommonFood[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { toast } = useToast();

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const { data, error } = await supabase
          .from("common_foods")
          .select("*");

        if (error) throw error;
        setFoods(data || []);
      } catch (error) {
        console.error("Error fetching foods:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger la base de données des aliments",
          variant: "destructive",
        });
      }
    };

    fetchFoods();
  }, [toast]);

  const categories = ["all", ...new Set(foods.map(food => food.food_category))];
  const filteredFoods = selectedCategory === "all" 
    ? foods 
    : foods.filter(food => food.food_category === selectedCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Base de données alimentaire</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "Tous" : category}
              </Badge>
            ))}
          </div>

          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="space-y-4">
              {filteredFoods.map((food) => (
                <div
                  key={food.name}
                  className="flex justify-between items-start p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <h3 className="font-medium">{food.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {food.calories} kcal | {food.proteins}g protéines
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {food.carbs}g glucides | {food.fats}g lipides
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};