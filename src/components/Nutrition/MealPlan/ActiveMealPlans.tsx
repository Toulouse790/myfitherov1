import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DayMeals } from "./DayMeals";
import { ShoppingList } from "./ShoppingList";
import { defaultMeals } from "@/data/meals/mealPlanGenerator";

interface ActiveMealPlansProps {
  shoppingList?: string[];
}

export const ActiveMealPlans = ({ shoppingList = [] }: ActiveMealPlansProps) => {
  const { user } = useAuth();

  const { data: activePlans } = useQuery({
    queryKey: ['active-meal-plans', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .gte('end_date', new Date().toISOString())
        .order('start_date', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data?.[0] || null;
    },
    enabled: !!user?.id
  });

  if (!activePlans) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Plan en cours</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Aucun plan actif. Générez un nouveau plan pour commencer.
          </p>
        </CardContent>
      </Card>
    );
  }

  const planData = activePlans.plan_data;
  const startDate = new Date(activePlans.start_date);
  const endDate = new Date(activePlans.end_date);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Plan en cours</CardTitle>
          <p className="text-sm text-muted-foreground">
            Du {startDate.toLocaleDateString()} au {endDate.toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {Object.entries(planData).map(([day, meals], index) => (
            <DayMeals 
              key={day} 
              day={day} 
              meals={meals as any} 
              isFirst={index === 0}
              mealTitles={defaultMeals}
            />
          ))}
        </CardContent>
      </Card>

      {shoppingList.length > 0 && <ShoppingList items={shoppingList} />}
    </div>
  );
};